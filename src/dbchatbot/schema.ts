import { pgTable, uuid, text, vector } from "drizzle-orm/pg-core";

/*
export const companyPolicies = pgTable("company_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Nội dung văn bản của chính sách (ví dụ: "Nhân viên được nghỉ phép 12 ngày...")
  content: text("content").notNull(),
  
  // Cột chứa tọa độ Vector. 
  // 1536 là số chiều tiêu chuẩn của model text-embedding-3-small từ OpenAI.
  embedding: vector("embedding", { dimensions: 1536 }),
    
  // Thông tin bổ sung (tên file, chương, ngày cập nhật...)
  metadata: text("metadata"), 
});
*/

// src/dbchatbot/schema.ts
//import { pgTable, uuid, text, vector } from "drizzle-orm/pg-core";

export const companyPolicies = pgTable("company_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  // Sửa dimensions thành 768 ở đây
  embedding: vector("embedding", { dimensions: 3072 }), 
  metadata: text("metadata"),
});
