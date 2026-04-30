import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  product_type_id: uuid("product_type_id"),
  description: text("description"),
  short_description: text("short_description"),
  status: text("status").notNull().default("draft"),
  thumbnail_url: text("thumbnail_url"), // Đây là cột chứa ảnh bạn cần
  category_id: uuid("category_id"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    slugIdx: uniqueIndex("idx_products_slug").on(table.slug),
  };
});


/*
Sử dụng để lấy ảnh trực tiếp trong bảng products ở db neon
bằng kết quả tìm kiếm của chatbot: dúng slug
*/