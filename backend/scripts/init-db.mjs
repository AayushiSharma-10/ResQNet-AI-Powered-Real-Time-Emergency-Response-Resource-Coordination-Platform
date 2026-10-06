import { execSync } from 'node:child_process';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Set it in backend/.env before initializing the database.');
}

const env = { ...process.env };

console.log('Applying Prisma schema...');
execSync('node ./node_modules/prisma/build/index.js db push', { stdio: 'inherit', env });
console.log('Seeding demo data...');
execSync('node ./node_modules/tsx/dist/cli.mjs prisma/seed.ts', { stdio: 'inherit', env });
console.log('Database initialized.');
