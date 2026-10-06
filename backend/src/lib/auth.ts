import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { User } from '@prisma/client';

export type SessionUser = Pick<User, 'id' | 'email' | 'role' | 'firstName' | 'lastName'>;

export const hashPassword = async (password: string) => bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) => bcrypt.compare(password, hash);

export const signToken = (user: SessionUser) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as { sub: string; role: string; email: string };
