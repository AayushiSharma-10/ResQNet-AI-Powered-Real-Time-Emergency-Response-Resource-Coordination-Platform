import { Router } from 'express';
import { z } from 'zod';
import { comparePassword, hashPassword, signToken } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { loginSchema, registerSchema } from '../lib/validation.js';
import { emitToAll } from '../services/socket.js';

const router = Router();

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid registration payload.', issues: parsed.error.flatten() });

  const data = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return res.status(409).json({ message: 'User already exists.' });

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone ?? null,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    },
  });

  emitToAll('user:registered', { id: user.id, email: user.email, role: user.role });

  const token = signToken({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName });
  res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid login payload.' });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

  const valid = await comparePassword(parsed.data.password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials.' });

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const token = signToken({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      mfaEnabled: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json({ user });
});

router.post('/logout', requireAuth, async (_req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

export default router;
