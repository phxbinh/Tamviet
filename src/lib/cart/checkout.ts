import { pool } from "@/lib/db/pg";

export async function checkout({
  userId,
}: {
  userId: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. lấy cart
    const cartRes = await client.query(
      `
      SELECT id 
      FROM carts
      WHERE user_id = $1 AND status = 'active'
      LIMIT 1
      `,
      [userId]
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

    // 4. tạo order (FIX total_price)
    const orderRes = await client.query(
      `
      INSERT INTO orders (user_id, total_price, status)
      VALUES ($1, $2, 'pending')
      RETURNING id
      `,
      [userId, totalPrice]
    );

    const orderId = orderRes.rows[0].id;

    // 5. insert order_items (BATCH - nhanh hơn loop)
    await client.query(
      `
      INSERT INTO order_items (order_id, variant_id, quantity, price)
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

    // 6. trừ stock (BATCH)
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

    // 7. clear cart
    await client.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    // 8. mark cart done
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
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}