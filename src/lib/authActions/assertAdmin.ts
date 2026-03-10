
import { requireAdmin } from './requireAdmin';
import { ForbiddenError } from '../errors';

// lib/auth/assertAdmin.ts
export async function assertAdmin(userId: string) {
  try {
    await requireAdmin(userId);
  } catch {
    throw new ForbiddenError();
  }
}




