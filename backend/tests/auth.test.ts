import { describe, expect, it } from 'vitest';
import type { RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken } from '../src/lib/auth.js';

describe('Authentication helpers', () => {
  it('issues a token that round-trips the same payload', () => {
    const user = { id: 'user-123', email: 'alice@example.com', role: 'DISPATCHER' as RoleName, firstName: 'Alice', lastName: 'Nguyen' };
    const token = signToken(user);
    const payload = verifyToken(token);

    expect(payload.sub).toBe('user-123');
    expect(payload.email).toBe('alice@example.com');
    expect(payload.role).toBe('DISPATCHER');
  });

  it('hashes passwords securely and validates them', async () => {
    const password = 'StrongPassword123!';
    const hash = await bcrypt.hash(password, 10);
    const valid = await bcrypt.compare(password, hash);
    expect(valid).toBe(true);
  });
});
