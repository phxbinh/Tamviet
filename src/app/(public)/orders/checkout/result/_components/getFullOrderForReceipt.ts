// _components/getFullOrderForReceipt.ts
"use server";

import { sql } from "@/lib/neon/sql";

export async function getFullOrderForReceipt(orderId: string) {
  try {
    // 1. Lấy order
    const order = await sql`
      SELECT *
      FROM orders
      WHERE order_id = ${orderId}
      LIMIT 1
    `;

    if (!order[0]) {
      throw new Error("Order not found");
    }

    const orderUUID = order[0].id;

    // 2. Lấy address
    const address = await sql`
      SELECT *
      FROM order_addresses
      WHERE order_id = ${orderUUID}
      LIMIT 1
    `;

    // 3. Lấy items (join variant nếu cần)
    const items = await sql`
      SELECT 
        oi.*,
        pv.sku,
        pv.price as current_price
      FROM order_items oi
      LEFT JOIN product_variants pv ON pv.id = oi.variant_id
      WHERE oi.order_id = ${orderUUID}
    `;

    return {
      order: order[0],
      address: address[0] || null,
      items,
    };
  } catch (err) {
    console.error("getFullOrderForReceipt error:", err);
    throw err;
  }
}