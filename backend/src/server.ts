import express from 'express';
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import sanitizeHtml from 'sanitize-html';

import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import incidentRoutes from './routes/incidents.js';
import resourceRoutes from './routes/resources.js';
import alertRoutes from './routes/alerts.js';
import notificationRoutes from './routes/notifications.js';
import hospitalRoutes from './routes/hospitals.js';
import responderRoutes from './routes/responders.js';
import fileRoutes from './routes/files.js';
import analyticsRoutes from './routes/analytics.js';
import aiRoutes from './routes/ai.js';
import { setSocketServer } from './services/socket.js';

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, sanitizeValue(child)]),
    );
  }
  return value;
};

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

setSocketServer(io);

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body) as typeof req.body;
  }
  next();
});

app.use(
  '/api',
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'resqnet-api', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/responders', responderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

io.on('connection', (socket) => {
  socket.on('join-room', (room: string) => {
    socket.join(room);
  });

  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });
});

server.listen(env.PORT, () => {
  console.log(`ResQNet API listening on http://localhost:${env.PORT}`);
});

export { app, io };
