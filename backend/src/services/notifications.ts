import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { emitToAll } from './socket.js';

export const createInAppNotification = async (userId: string | null, title: string, message: string, incidentId?: string | null, metadata?: Record<string, unknown>) => {
  const notification = await prisma.notification.create({
    data: {
      userId: userId ?? null,
      incidentId: incidentId ?? null,
      title,
      message,
      channel: 'IN_APP',
      status: 'SENT',
      metadata: (metadata ?? {}) as Prisma.InputJsonValue,
    },
  });

  emitToAll('notification:new', notification);
  return notification;
};

export const sendEmail = async (_email: string, _subject: string, _body: string) => ({ sent: true, provider: 'demo' });
export const sendSMS = async (_phone: string, _body: string) => ({ sent: true, provider: 'demo' });
export const sendPush = async (_token: string, _body: string) => ({ sent: true, provider: 'demo' });
