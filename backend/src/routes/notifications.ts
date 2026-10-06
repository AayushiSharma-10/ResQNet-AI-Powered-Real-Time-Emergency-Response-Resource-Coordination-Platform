import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ notifications });
});

router.patch('/:id/read', requireAuth, async (req, res) => {
  const notificationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: { status: 'READ', readAt: new Date() },
  });
  res.json({ notification });
});

export default router;
