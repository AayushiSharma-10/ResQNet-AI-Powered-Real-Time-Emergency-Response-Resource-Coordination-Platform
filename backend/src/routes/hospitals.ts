import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const hospitals = await prisma.hospitalProfile.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ hospitals });
});

router.post('/', requireAuth, async (req, res) => {
  const { facilityName, emergencyBeds, icuBeds, totalCapacity, latitude, longitude } = req.body;

  const profile = await prisma.hospitalProfile.create({
    data: {
      facilityName,
      emergencyBeds: Number(emergencyBeds ?? 0),
      icuBeds: Number(icuBeds ?? 0),
      totalCapacity: Number(totalCapacity ?? 0),
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      userId: req.user!.id,
    },
  });

  res.status(201).json({ profile });
});

export default router;
