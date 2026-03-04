// src/lib/dataQueries/profiles.ts
import { sql, sqlAdmin, sqlApp } from '../neon/sql';
export async function withUserContext<T>(
  userId: string,
  queryFn: (tx: any) => any
): Promise<T> {

  const results = await sqlApp.transaction((tx) => [
    tx`SELECT set_config('app.user_id', ${userId}, true)`,
    queryFn(tx),
  ])
  //console.log("userId: ", userId);
  return results[1] as T
}


export async function getMyProfile(
  userId: string
): Promise<Profile | null> {
  return withUserContext<Profile | null>(userId, async (tx) => {
    const rows = await tx`
      select
        user_id,
        role,
        avatar_url,
        created_at,
        updated_at
      from profiles
      where user_id = ${userId}
      limit 1
    `;

    return rows[0] ?? null;
  });
}