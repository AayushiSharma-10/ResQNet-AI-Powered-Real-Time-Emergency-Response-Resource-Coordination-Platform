import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const responders = await prisma.user.findMany({
    where: { role: 'RESPONDER' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      lastKnownLocationLat: true,
      lastKnownLocationLng: true,
    },
  });
  res.json({ responders });
});

export default router;
