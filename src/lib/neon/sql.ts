// src/lib/neon/sql.ts
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
// Sử dụng nếu muốn byPass toàn bộ RLS
export const sql = neon(process.env.DATABASE_URL);
export const sqlAdmin = neon(process.env.DATABASE_URL!)

// Sử dụng để lấy data trong Neon PostgreSQL với RLS được bật
export const sqlApp = neon(process.env.DATABASE_URL_APP!)
