
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
  } catch (err: any) {
    await client.query("ROLLBACK");
    //throw err;
    return { success: false, error: err.message || "Thanh toán thất bại" };
  } finally {
    client.release();
  }
}

/*
'use server'

import { pool } from "@/lib/db/pg";
import { getCartIdentity } from "@/lib/cart/sqlCart";
import { revalidatePath } from "next/cache";

export async function checkoutAction() {
  const identity = await getCartIdentity();
  const userId = identity.userId ?? null;
  const guestId = identity.guestId ?? null;

  const client = await pool.connect();

  try {
    // CHỈ DÙNG 1 LỆNH QUERY DUY NHẤT CHO TOÀN BỘ LOGIC
    const result = await client.query(`
      WITH 
      -- 1. Tìm Cart đang active
      target_cart AS (
        SELECT id FROM carts 
        WHERE status = 'active' 
        AND ((user_id = $1 AND $1 IS NOT NULL) OR (guest_id = $2 AND $2 IS NOT NULL))
        LIMIT 1
      ),
      -- 2. Kiểm tra Stock và Lock các bản ghi để tránh tranh chấp (Race Condition)
      check_items AS (
        SELECT 
          ci.variant_id, 
          ci.quantity, 
          pv.price,
          pv.stock
        FROM cart_items ci
        JOIN product_variants pv ON pv.id = ci.variant_id
        WHERE ci.cart_id = (SELECT id FROM target_cart)
        FOR UPDATE
      ),
      -- 3. Kiểm tra nếu có sản phẩm nào hết hàng (Sẽ gây lỗi Transaction nếu thỏa mãn)
      validate_stock AS (
        SELECT 1 FROM check_items WHERE stock < quantity
      ),
      -- 4. Tạo Order mới và tính tổng tiền trực tiếp
      new_order AS (
        INSERT INTO orders (user_id, guest_id, total_price, status)
        SELECT $1, $2, SUM(price * quantity), 'pending'
        FROM check_items
        WHERE NOT EXISTS (SELECT 1 FROM validate_stock) -- Chỉ chạy nếu stock đủ
        RETURNING id
      ),
      -- 5. Sao chép items sang order_items
      move_items AS (
        INSERT INTO order_items (order_id, variant_id, quantity, price_at_time)
        SELECT (SELECT id FROM new_order), variant_id, quantity, price
        FROM check_items
      ),
      -- 6. Cập nhật trừ kho
      reduce_stock AS (
        UPDATE product_variants pv
        SET stock = pv.stock - ci.quantity
        FROM check_items ci
        WHERE pv.id = ci.variant_id
      ),
      -- 7. Xóa sạch giỏ hàng cũ
      clear_cart_items AS (
        DELETE FROM cart_items WHERE cart_id = (SELECT id FROM target_cart)
      )
      -- 8. Hoàn tất: Cập nhật trạng thái giỏ hàng và trả về Order ID
      UPDATE carts 
      SET status = 'checked_out', updated_at = now()
      WHERE id = (SELECT id FROM target_cart)
      AND EXISTS (SELECT id FROM new_order)
      RETURNING (SELECT id FROM new_order) as order_id;
    `, [userId, guestId]);

    // Kiểm tra kết quả trả về từ câu query gộp
    const orderId = result.rows[0]?.order_id;

    if (!orderId) {
      throw new Error("Thanh toán thất bại: Giỏ hàng trống hoặc hết hàng.");
    }

    revalidatePath('/cart');
    revalidatePath('/orders');

    return { success: true, orderId };

  } catch (err: any) {
    console.error("Checkout SQL Error:", err.message);
    return { success: false, error: err.message || "Lỗi hệ thống khi thanh toán" };
  } finally {
    client.release();
  }
}
*/




