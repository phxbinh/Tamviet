import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/dbchatbot/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});


/*
2. Các điểm cần bổ sung và tối ưu
Đoạn mã của bạn đã chạy được, nhưng để dự án phát triển lâu dài và an toàn, bạn nên tối ưu lại theo các hướng sau:
⚡ Tối ưu 1: Hỗ trợ nhiều file Schema (Nếu dự án lớn lên)
Hiện tại bạn đang chỉ định chính xác 1 file schema.ts. Nếu sau này chatbot của bạn có thêm nhiều tính năng (users, logs, analytics...) và bạn muốn chia nhỏ schema ra cho dễ quản lý, bạn nên cấu hình dạng Glob pattern (dùng dấu sao *).
🔒 Tối ưu 2: Bảo mật và Kiểm tra Biến Môi Trường (dotenv)
Khi chạy các lệnh CLI của Drizzle Kit (như drizzle-kit push hay generate), đôi khi nó không tự động đọc được file .env của bạn nếu không được cấu hình rõ ràng. Ngoài ra, dùng dấu ! có thể gây lỗi crash lúc runtime nếu bạn quên chưa tạo file .env.
🛡️ Tối ưu 3: Thêm chế độ an toàn (breakpoints)
Nên bật tính năng breakpoints để khi Drizzle Kit tạo file migration, nó sẽ chèn các điểm ngắt giúp đảm bảo các câu lệnh SQL không bị xung đột hoặc chạy lỗi giữa chừng.
*/

/*
// 3. Code below
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Đảm bảo Drizzle Kit luôn đọc được biến môi trường từ file .env
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL không tồn tại trong file .env');
}

export default defineConfig({
  // Sửa thành *.ts để sau này bạn chia nhỏ schema trong thư mục dbchatbot thành nhiều file vẫn chạy tốt
  schema: './src/dbchatbot/schema.ts', 
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL, // Bỏ dấu ! vì đã có check error ở trên
  },
  // Các tùy chọn tối ưu thêm:
  breakpoints: true, // Giúp migration an toàn hơn
  verbose: true,     // In chi tiết các câu lệnh SQL ra terminal khi chạy để dễ debug
  strict: true,      // Yêu cầu xác nhận khi có các hành động nguy hiểm (như drop cột)
});

*/