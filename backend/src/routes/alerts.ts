import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { alertSchema } from '../lib/validation.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const alerts = await prisma.alert.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ alerts });
});

router.post('/', requireRoles('DISPATCHER', 'ADMINISTRATOR', 'EMERGENCY_AUTHORITY'), async (req, res) => {
  const parsed = alertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid alert payload.', issues: parsed.error.flatten() });

  const alert = await prisma.alert.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      severity: parsed.data.severity,
      area: parsed.data.area ?? 'All zones',
      targetAudience: parsed.data.targetAudience ?? 'all',
      startTime: parsed.data.startTime,
      expiryTime: parsed.data.expiryTime ?? new Date(Date.now() + 60 * 60 * 1000),
      isActive: true,
    },
  });

  res.status(201).json({ alert });
});

export default router;
