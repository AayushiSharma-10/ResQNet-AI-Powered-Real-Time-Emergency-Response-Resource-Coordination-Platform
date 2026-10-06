import dotenv from 'dotenv';

dotenv.config();

dotenv.config({ path: '.env.local' });

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-key',
  DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db',
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:3000',
  UPLOAD_DIR: process.env.UPLOAD_DIR ?? './uploads',
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
  RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 120),
  AI_PROVIDER: process.env.AI_PROVIDER ?? 'demo',
  AI_API_KEY: process.env.AI_API_KEY ?? '',
};
