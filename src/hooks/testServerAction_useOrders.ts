"use server"; // Bắt buộc phải có dòng này

import { pool } from "@/lib/db/pg";
import { getCurrentUser } from "@/lib/authActions/getUser";
import { cookies } from "next/headers";

export async function getOrdersAction() {
  const client = await pool.connect();

  try {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const guestId = cookieStore.get("guest_id")?.value;

    // 1. Lấy orders
    const ordersRes = await client.query(
      `
      SELECT *
      FROM orders
      WHERE 
        (user_id = $1 AND $1 IS NOT NULL)
        OR
        (guest_id = $2 AND $2 IS NOT NULL)
      ORDER BY created_at DESC
      `,
      [user?.id ?? null, guestId ?? null]
    );

    const orders = ordersRes.rows;

    if (orders.length === 0) {
      return { success: true, data: [] };
    }

    // 2. Lấy order_items
    const orderIds = orders.map((o) => o.id);
    const itemsRes = await client.query(
      `
      SELECT 
        oi.order_id,
        oi.variant_id,
        oi.quantity,
        oi.price_at_time,
        p.name,
        p.slug
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.variant_id
      JOIN products p ON p.id = pv.product_id
      WHERE oi.order_id = ANY($1)
      `,
      [orderIds]
    );

    const items = itemsRes.rows;

    // 3. Group dữ liệu
    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: items.filter((i) => i.order_id === order.id),
    }));

    return { success: true, data: ordersWithItems };
  } catch (err: any) {
    console.error("GET ORDERS ERROR:", err);
    return { success: false, error: err.message || "Failed to fetch orders" };
  } finally {
    client.release();
  }
}
