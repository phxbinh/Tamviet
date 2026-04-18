import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// 1. Tạo kết nối thô tới Neon qua giao thức HTTP
const sql = neon(process.env.DATABASE_URL!);

// 2. Bọc kết nối đó vào Drizzle để biến nó thành đối tượng "db" 
// giúp bạn viết code kiểu TypeScript thay vì viết SQL thuần
export const db = drizzle(sql);
