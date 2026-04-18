import { pgTable, uuid, text, vector } from "drizzle-orm/pg-core";

export const companyPolicies = pgTable("company_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Nội dung văn bản của chính sách (ví dụ: "Nhân viên được nghỉ phép 12 ngày...")
  content: text("content").notNull(),
  
  // Cột chứa tọa độ Vector. 
  // 1536 là số chiều tiêu chuẩn của model text-embedding-3-small từ OpenAI.
  //embedding: vector("embedding", { dimensions: 1536 }),
  
  // Dùng với gemini
  embedding: vector("embedding", { dimensions: 768 }),
  
  // Thông tin bổ sung (tên file, chương, ngày cập nhật...)
  metadata: text("metadata"), 
});
