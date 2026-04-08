import { pgTable, uuid, text, numeric, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const orders = pgTable("orders", {
  // 1. ID hệ thống (Khóa chính UUID)
  id: uuid("id").primaryKey().defaultRandom(),

  // 2. ID hiển thị (Mã ORD-...) - Bạn đã thêm Unique Index và Not Null
  order_id: text("order_id").notNull().unique(), 
  
  user_id: uuid("user_id"),
  guest_id: text("guest_id"),

  // Trạng thái: pending | paid | shipped | completed | cancelled
  status: text("status").notNull().default("pending"), 

  // Tổng tiền - Có constraint >= 0
  total_price: numeric("total_price", { precision: 12, scale: 2 }).notNull(),

  // Phương thức thanh toán - Có constraint check enum
  payment_method: text("payment_method"), 
  
  // Mã giao dịch từ cổng thanh toán - Có unique index
  payment_gateway_id: text("payment_gateway_id"),

  // Timestamptz tương ứng với timestamptz trong SQL
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    // Khai báo các constraints để Drizzle hiểu (tùy chọn nhưng nên có)
    checkPrice: check("check_total_price_positive", sql`${table.total_price} >= 0`),
    checkMethod: check("orders_payment_method_check", sql`${table.payment_method} IN ('cod', 'vnpay', 'momo', 'stripe')`),
  };
});

