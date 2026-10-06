import { Router } from 'express';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { incidentSchema } from '../lib/validation.js';
import { buildAIAssessment } from '../services/ai.js';
import { createInAppNotification } from '../services/notifications.js';
import { emitToAll } from '../services/socket.js';

const router = Router();

const asQueryString = (value: unknown) => {
  if (Array.isArray(value)) return String(value[0] ?? '');
  if (typeof value === 'string') return value;
  return value == null ? '' : String(value);
};

router.get('/', requireAuth, async (req, res) => {
  const page = Number(asQueryString(req.query.page) || '1');
  const limit = Number(asQueryString(req.query.limit) || '20');
  const search = asQueryString(req.query.search);
  const status = asQueryString(req.query.status) as any;
  const severity = asQueryString(req.query.severity) as any;

  const skip = (page - 1) * limit;

  const conditions: Prisma.IncidentWhereInput[] = [];
  if (req.user!.role === 'CITIZEN') {
    conditions.push({ reportedById: req.user!.id });
  } else if (req.user!.role === 'RESPONDER') {
    conditions.push({
      OR: [
        { assignments: { some: { responderId: req.user!.id } } },
        { dispatches: { some: { assignedToUserId: req.user!.id } } },
      ],
    });
  } else if (req.user!.role === 'HOSPITAL') {
    conditions.push({ dispatches: { some: { assignedToUserId: req.user!.id } } });
  }
  if (status) conditions.push({ status });
  if (severity) conditions.push({ severity });
  if (search) {
    conditions.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { locationName: { contains: search, mode: 'insensitive' } },
      ],
    });
  }
  const where: Prisma.IncidentWhereInput = { AND: conditions };

  const [incidents, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      include: { updates: true, assignments: true, alerts: true, aiAssessments: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.incident.count({ where }),
  ]);

  res.json({ incidents, total, page, limit });
});

router.get('/:id', requireAuth, async (req, res) => {
  const incidentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: { updates: true, assignments: true, alerts: true, aiAssessments: true },
  });

  if (!incident || (req.user!.role === 'CITIZEN' && incident.reportedById !== req.user!.id)) {
    return res.status(404).json({ message: 'Incident not found.' });
  }
  if (
    req.user!.role === 'RESPONDER' &&
    !incident.assignments.some((assignment) => assignment.responderId === req.user!.id)
  ) {
    const assignedDispatch = await prisma.dispatch.findFirst({
      where: { incidentId, assignedToUserId: req.user!.id },
      select: { id: true },
    });
    if (!assignedDispatch) return res.status(404).json({ message: 'Incident not found.' });
  }
  if (req.user!.role === 'HOSPITAL') {
    const assignedDispatch = await prisma.dispatch.findFirst({
      where: { incidentId, assignedToUserId: req.user!.id },
      select: { id: true },
    });
    if (!assignedDispatch) return res.status(404).json({ message: 'Incident not found.' });
  }

  res.json({ incident });
});

router.post('/', requireAuth, requireRoles('CITIZEN', 'DISPATCHER', 'ADMINISTRATOR', 'EMERGENCY_AUTHORITY'), async (req, res) => {
  const parsed = incidentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid incident payload.', issues: parsed.error.flatten() });

  const data = parsed.data;
  const classification = buildAIAssessment({
    type: data.type,
    description: data.description,
    locationName: data.locationName,
    peopleAffected: data.numberPeopleAffected,
    injuries: data.injuries,
    hazards: data.hazards,
  });

  const incident = await prisma.incident.create({
    data: {
      incidentNumber: `RQ-${Math.floor(Math.random() * 900000 + 100000)}`,
      title: data.title,
      description: data.description,
      type: data.type,
      severity: classification.severity.severity,
      status: 'RECEIVED',
      locationName: data.locationName ?? 'Unknown',
      latitude: data.latitude ?? 0,
      longitude: data.longitude ?? 0,
      priorityScore: classification.severity.score,
      estimatedResponseTime: 7,
      createdById: req.user!.id,
      reportedById: req.user!.id,
    },
    include: { updates: true },
  });

  await prisma.aIAssessment.create({
    data: {
      incidentId: incident.id,
      assessmentType: 'triage',
      model: 'demo-ai',
      confidence: classification.classification.confidence,
      score: classification.severity.score,
      result: classification,
      requiresHumanConfirmation: classification.severity.requiresHumanConfirmation,
    },
  });

  await prisma.incidentUpdate.create({
    data: {
      incidentId: incident.id,
      authorName: `${req.user!.firstName} ${req.user!.lastName}`,
      content: `Incident received and AI triage completed with ${classification.severity.severity.toLowerCase()} severity.`,
      status: 'TRIAGE_COMPLETE',
    },
  });

  await createInAppNotification(req.user!.id, 'Incident submitted', `Incident ${incident.incidentNumber} was created and triaged.`, incident.id, { severity: classification.severity.severity });
  emitToAll('incident:created', incident);

  res.status(201).json({ incident, ai: classification });
});

router.patch('/:id/dispatch', requireAuth, requireRoles('DISPATCHER', 'ADMINISTRATOR', 'EMERGENCY_AUTHORITY'), async (req, res) => {
  const dispatchSchema = z.object({
    resourceType: z.string(),
    resourceId: z.string().optional(),
    responderId: z.string().optional(),
    etaMinutes: z.number().optional(),
  });

  const incidentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = dispatchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid dispatch payload.' });

  const incident = await prisma.incident.update({
    where: { id: incidentId },
    data: {
      status: 'DISPATCHED',
    },
  });

  const dispatch = await prisma.dispatch.create({
    data: {
      incidentId,
      dispatchType: 'manual',
      resourceType: parsed.data.resourceType,
      resourceId: parsed.data.resourceId ?? null,
      assignedToUserId: parsed.data.responderId ?? null,
      status: 'pending',
      etaMinutes: parsed.data.etaMinutes ?? 7,
    },
  });

  emitToAll('dispatch:updated', { incident, dispatch });
  res.json({ incident, dispatch });
});

router.patch('/:id/status', requireAuth, requireRoles('RESPONDER', 'DISPATCHER', 'ADMINISTRATOR', 'EMERGENCY_AUTHORITY'), async (req, res) => {
  const schema = z.object({ status: z.enum(['RECEIVED', 'TRIAGE_COMPLETE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'RESOLVING', 'RESOLVED', 'CLOSED']) });
  const incidentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid status update.' });

  if (req.user!.role === 'RESPONDER') {
    const [assignment, dispatch] = await Promise.all([
      prisma.incidentAssignment.findFirst({
        where: { incidentId, responderId: req.user!.id },
        select: { id: true },
      }),
      prisma.dispatch.findFirst({
        where: { incidentId, assignedToUserId: req.user!.id },
        select: { id: true },
      }),
    ]);
    if (!assignment && !dispatch) return res.status(404).json({ message: 'Incident not found.' });
  }

  const incident = await prisma.incident.update({ where: { id: incidentId }, data: { status: parsed.data.status } });
  emitToAll('incident:status', { incident });
  res.json({ incident });
});

export default router;
