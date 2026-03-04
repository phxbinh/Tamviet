// src/lib/dataQueries/profiles.ts
import { sqlApp } from '../neon/sql';

export type Profile = {
  user_id: string;
  role: 'admin' | 'user';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function withUserContext<T>(
  userId: string,
  queryFn: (tx: any) => any
): Promise<T> {

  const results = await sqlApp.transaction((tx) => [
    tx`SELECT set_config('app.user_id', ${userId}, true)`,
    queryFn(tx), // KHÔNG await ở đây
  ]);

  return results[1] as T;
}

export async function getMyProfile(
  userId: string
): Promise<Profile | null> {

  const rows = await withUserContext<Profile[]>(
    userId,
    (tx) => tx`
      select
        user_id,
        role,
        avatar_url,
        created_at,
        updated_at
      from profiles
      where user_id = ${userId}
      limit 1
    `
  );

  return rows[0] ?? null;
}






