import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const resources = await prisma.resource.findMany({ orderBy: { updatedAt: 'desc' } });
  res.json({ resources });
});

router.post('/', requireAuth, async (req, res) => {
  const { resourceType, name, status, capacity, locationName, latitude, longitude } = req.body;
  const resource = await prisma.resource.create({
    data: {
      resourceType,
      name,
      status: status ?? 'AVAILABLE',
      capacity: capacity ?? 1,
      locationName,
      latitude,
      longitude,
      availability: true,
    },
  });

  res.status(201).json({ resource });
});

export default router;
