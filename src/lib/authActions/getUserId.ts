// src/lib/auth/getUserId.ts
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { UnauthorizedError } from '@/lib/errors';

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new UnauthorizedError();
  }

  return user.id;
}