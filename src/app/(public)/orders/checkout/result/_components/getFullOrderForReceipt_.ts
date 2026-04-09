"use server";

import { pool } from "@/lib/db/pg";
import { getCurrentUser } from "@/lib/authActions/getUser";
import { cookies } from "next/headers";

export async function getFullOrderForReceipt_(orderId: string) {
  const client = await pool.connect();

  try {
    // 🔐 Identity
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const guestId = cookieStore.get("guest_id")?.value ?? null;

    if (!user?.id && !guestId) {
      throw new Error("Unauthorized");
    }

    // 1️⃣ Lấy order (có auth)
    const orderRes = await client.query(
      `
      SELECT *
      FROM orders
      WHERE order_id = $1
      AND (
        ($2 IS NOT NULL AND user_id = $2)
        OR
        ($3 IS NOT NULL AND guest_id = $3)
      )
      LIMIT 1
      `,
      [orderId, user?.id ?? null, guestId]
    );

    if (orderRes.rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderRes.rows[0];
    const orderUUID = order.id;

    // 2️⃣ Address
    const addressRes = await client.query(
      `
      SELECT *
      FROM order_addresses
      WHERE order_id = $1
      LIMIT 1
      `,
      [orderUUID]
    );

    // 3️⃣ Items + image
    const itemsRes = await client.query(
      `
      SELECT 
        oi.variant_id,
        oi.quantity,
        oi.price_at_time,

        p.name,
        p.slug,

        img.image_url AS image_item

      FROM order_items oi

      JOIN product_variants pv 
        ON pv.id = oi.variant_id

      JOIN products p 
        ON p.id = pv.product_id

      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE 
          variant_id = pv.id
          OR (product_id = p.id AND variant_id IS NULL)
        ORDER BY 
          (variant_id IS NOT NULL) DESC,
          id ASC
        LIMIT 1
      ) img ON true

      WHERE oi.order_id = $1
      `,
      [orderUUID]
    );

    return {
      success: true,
      data: {
        order,
        address: addressRes.rows[0] || null,
        items: itemsRes.rows,
      },
    };
  } catch (err: any) {
    console.error("getFullOrderForReceipt error:", err);

    return {
      success: false,
      error: err.message || "Failed to fetch order",
    };
  } finally {
    client.release();
  }
}