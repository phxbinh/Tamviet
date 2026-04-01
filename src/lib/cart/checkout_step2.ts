// src/lib/actions/checkoutAction.ts
// Thêm thông tin người mua và nhận hàng
"use server";

import { pool } from "@/lib/db/pg";
import { getCurrentUser } from "@/lib/authActions/getUser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function checkoutAction(formData: FormData) {
  const client = await pool.connect();

  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const addressLine1 = formData.get("addressLine1") as string;
    const city = formData.get("city") as string;

    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const guestId = cookieStore.get("guest_id")?.value;

    await client.query("BEGIN");

    // giống logic mày đã có
    const cartRes = await client.query(
      `
      SELECT id FROM carts
      WHERE status = 'active'
      AND (
        (user_id = $1 AND $1 IS NOT NULL)
        OR (guest_id = $2 AND $2 IS NOT NULL)
      )
      LIMIT 1
      `,
      [user?.id ?? null, guestId ?? null]
    );

    if (cartRes.rows.length === 0) throw new Error("Cart not found");

    const cartId = cartRes.rows[0].id;

    const itemsRes = await client.query(
      `
      SELECT ci.variant_id, ci.quantity, pv.price, pv.stock
      FROM cart_items ci
      JOIN product_variants pv ON pv.id = ci.variant_id
      WHERE ci.cart_id = $1
      FOR UPDATE
      `,
      [cartId]
    );

    const items = itemsRes.rows;

    if (items.length === 0) throw new Error("Cart empty");

    for (const i of items) {
      if (i.stock < i.quantity) throw new Error("Out of stock");
    }

    const total = items.reduce(
      (sum, i) => sum + Number(i.price) * i.quantity,
      0
    );

    const orderRes = await client.query(
      `
      INSERT INTO orders (user_id, guest_id, total_price)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [user?.id ?? null, guestId ?? null, total]
    );

    const orderId = orderRes.rows[0].id;

    for (const i of items) {
      await client.query(
        `
        INSERT INTO order_items (order_id, variant_id, quantity, price_at_time)
        VALUES ($1, $2, $3, $4)
        `,
        [orderId, i.variant_id, i.quantity, i.price]
      );
    }

    await client.query(
      `
      INSERT INTO order_addresses (order_id, full_name, phone, address_line1, city)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [orderId, fullName, phone, addressLine1, city]
    );

    await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);
    await client.query(`UPDATE carts SET status = 'checked_out' WHERE id = $1`, [cartId]);

    await client.query("COMMIT");

    redirect(`/orders/${orderId}`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}