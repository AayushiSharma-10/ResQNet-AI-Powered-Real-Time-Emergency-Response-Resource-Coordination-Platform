import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/summary', requireAuth, requireRoles('DISPATCHER', 'ADMINISTRATOR', 'EMERGENCY_AUTHORITY'), async (_req, res) => {
  const [totalIncidents, criticalIncidents, activeAlerts, resources, responseAvg] = await Promise.all([
    prisma.incident.count(),
    prisma.incident.count({ where: { severity: 'CRITICAL' } }),
    prisma.alert.count({ where: { isActive: true } }),
    prisma.resource.count(),
    prisma.incident.aggregate({
      _avg: { priorityScore: true },
    }),
  ]);

  res.json({
    totals: {
      totalIncidents,
      criticalIncidents,
      activeAlerts,
      resources,
      avgPriority: responseAvg._avg.priorityScore ?? 0,
    },
  });
});

export default router;
