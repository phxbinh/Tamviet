'use server' // Bắt buộc phải có dòng này

import { pool } from "@/lib/db/pg";
import { getCartIdentity } from "@/lib/cart/sqlCart";
import { revalidatePath } from "next/cache";

export async function checkoutAction() {
  // 1. Lấy identity ngay tại server để bảo mật
  const identity = await getCartIdentity();
  const userId = identity.userId ?? undefined;
  const guestId = identity.guestId ?? undefined;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. lấy cart theo user hoặc guest
    const cartRes = await client.query(
      `
      SELECT id 
      FROM carts
      WHERE status = 'active'
      AND (
        (user_id = $1 AND $1 IS NOT NULL)
        OR
        (guest_id = $2 AND $2 IS NOT NULL)
      )
      LIMIT 1
      `,
      [userId ?? null, guestId ?? null]
    );

    if (cartRes.rows.length === 0) {
      throw new Error("Cart not found");
    }

    const cartId = cartRes.rows[0].id;

    // 2. lấy items + LOCK STOCK
    const itemsRes = await client.query(
      `
      SELECT 
        ci.variant_id,
        ci.quantity,
        pv.price,
        pv.stock
      FROM cart_items ci
      JOIN product_variants pv ON pv.id = ci.variant_id
      WHERE ci.cart_id = $1
      FOR UPDATE
      `,
      [cartId]
    );

    const items = itemsRes.rows;

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 3. check stock + tính total
    let totalPrice = 0;

    for (const item of items) {
      const price = Number(item.price);
      const stock = Number(item.stock);
      const quantity = Number(item.quantity);

      if (stock < quantity) {
        throw new Error(`Out of stock: ${item.variant_id}`);
      }

      totalPrice += price * quantity;
    }

    // 4. tạo order (đúng schema)
    const orderRes = await client.query(
      `
      INSERT INTO orders (user_id, guest_id, total_price, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING id
      `,
      [userId ?? null, guestId ?? null, totalPrice]
    );

    const orderId = orderRes.rows[0].id;

    // 5. insert order_items (đúng column: price_at_time)
    await client.query(
      `
      INSERT INTO order_items (order_id, variant_id, quantity, price_at_time)
      SELECT
        $1,
        ci.variant_id,
        ci.quantity,
        pv.price
      FROM cart_items ci
      JOIN product_variants pv ON pv.id = ci.variant_id
      WHERE ci.cart_id = $2
      `,
      [orderId, cartId]
    );

    // 6. trừ stock
    await client.query(
      `
      UPDATE product_variants pv
      SET stock = pv.stock - ci.quantity
      FROM cart_items ci
      WHERE ci.variant_id = pv.id
      AND ci.cart_id = $1
      `,
      [cartId]
    );

    // 7. clear cart_items
    await client.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    // 8. update cart status
    await client.query(
      `
      UPDATE carts
      SET status = 'checked_out',
          updated_at = now()
      WHERE id = $1
      `,
      [cartId]
    );

    await client.query("COMMIT");

    return {
      success: true,
      orderId,
    };
  } catch (err: Any) {
    await client.query("ROLLBACK");
    //throw err;
    return { success: false, error: err.message || "Thanh toán thất bại" };
  } finally {
    client.release();
  }
}





