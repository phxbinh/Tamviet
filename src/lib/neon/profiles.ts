// lib/neon/profiles.ts
import { sql, sqlAdmin, sqlApp } from './sql';
// sql: dùng quyền cao nhất bỏ qua rls
// sqlAdmin: dùng quyền cao nhất bỏ qua rls
// sqlApp: được kiểm soát bởi RLS auth role

export type Profile = {
  user_id: string;
  role: 'admin' | 'user';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

// ✳️1. Lấy trực tiếp api ở server không truyền auth check role vào DB neon
export async function getAllProfiles(): Promise<Profile[]> {
  const rows = await sql`
    select
      user_id,
      role,
      avatar_url,
      created_at,
      updated_at
    from profiles
    order by created_at desc
  `;

  return rows as Profile[];
}


// ✳️2. Lấy toàn bộ data ở bảng profiles có RLS admin
// Bằng cách truyền auth role xuống để DB xử lý quyền
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

export async function getAllProfiles_(
  userId: string
): Promise<Profile[]> {
  return withUserContext<Profile[]>(userId, (tx) =>
    tx`
      select
        user_id,
        role,
        avatar_url,
        created_at,
        updated_at
      from profiles
      order by created_at desc
    `
  )
}


// ✳️3. byPass RLS
export async function withAdminContext<T>(
  queryFn: (sql: typeof sqlAdmin) => Promise<T>
): Promise<T> {
  return queryFn(sqlAdmin)
}

export async function getAllProfiles__() {
  return withAdminContext((sql) =>
    sql`SELECT * FROM profiles`
  )
}






