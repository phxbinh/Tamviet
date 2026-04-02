// lib/db/pg.ts
/*
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
*/


// lib/db/pg.ts
import { Pool, PoolConfig } from "pg";

/**
 * Định nghĩa cấu hình Pool để dễ quản lý
 * Bạn có thể tinh chỉnh max connection tùy theo gói database (vd: Neon, Supabase)
 */
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 10, // Giới hạn số lượng connection trong pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Khai báo kiểu cho biến global để TypeScript không báo lỗi
const globalForPg = global as unknown as {
  pool: Pool | undefined;
};

// Sử dụng pool đã có hoặc tạo mới nếu chưa tồn tại
export const pool = globalForPg.pool ?? new Pool(poolConfig);

// Trong môi trường development, lưu pool vào biến global để không bị tạo lại khi hot reload
if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}


