import { sql } from '@/lib/neon/sql';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './payment/schema';

// Chuỗi kết nối lấy từ biến môi trường (.env)
//const sql = neon(process.env.DATABASE_URL!);

// Khởi tạo đối tượng db và gán schema để có gợi ý code (Intellisense)
export const dbSql = drizzle(sql, { schema });
