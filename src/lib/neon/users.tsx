// lib/neon/users.ts
import { sql } from "./sql";

/**
 * Sync bảng users từ Supabase auth
 */
export async function syncUser(user: {
  id: string;
  email: string;
}) {
  await sql`
    INSERT INTO users (id, email)
    VALUES (${user.id}, ${user.email})
    ON CONFLICT (id) DO NOTHING
  `;
}

/**
 * Ensure profile tồn tại
 */
export async function ensureProfile(userId: string) {
  await sql`
    INSERT INTO profiles (user_id)
    VALUES (${userId})
    ON CONFLICT (user_id) DO NOTHING
  `;
}