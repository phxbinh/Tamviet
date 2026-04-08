
// Bản đã được: được tối ưu hóa bằng kỹ thuật CTE (Common Table Expressions).
// Thay vì thực hiện 8 lần await lẻ tẻ gửi đi gửi lại giữa Server và Database
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
    const result = await client.query(`
      WITH 
      -- 1. Tìm Cart đang active
      target_cart AS (
        SELECT id FROM carts 
        WHERE status = 'active' 
        AND (
          (user_id = $1 AND $1 IS NOT NULL) 
          OR 
          (guest_id = $2 AND $2 IS NOT NULL)
        )
        LIMIT 1
      ),

      -- 2. Lock item để tránh race condition
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

      -- 3. Validate stock
      validate_stock AS (
        SELECT 1 FROM check_items WHERE stock < quantity
      ),

      -- 4. Tạo Order + sinh order_id
      new_order AS (
        INSERT INTO orders (
          user_id, 
          guest_id, 
          total_price, 
          status,
          order_id
        )
        SELECT 
          $1, 
          $2, 
          SUM(price * quantity), 
          'pending',
          'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)
        FROM check_items
        WHERE NOT EXISTS (SELECT 1 FROM validate_stock)
        RETURNING id, order_id
      ),

      -- 5. Copy items sang order_items
      move_items AS (
        INSERT INTO order_items (order_id, variant_id, quantity, price_at_time)
        SELECT 
          (SELECT id FROM new_order), 
          variant_id, 
          quantity, 
          price
        FROM check_items
      ),

      -- 6. Trừ kho
      reduce_stock AS (
        UPDATE product_variants pv
        SET stock = pv.stock - ci.quantity
        FROM check_items ci
        WHERE pv.id = ci.variant_id
      ),

      -- 7. Clear cart
      clear_cart_items AS (
        DELETE FROM cart_items 
        WHERE cart_id = (SELECT id FROM target_cart)
      )

      -- 8. Update cart + trả kết quả
      UPDATE carts 
      SET status = 'checked_out', updated_at = now()
      WHERE id = (SELECT id FROM target_cart)
      AND EXISTS (SELECT 1 FROM new_order)

      RETURNING 
        (SELECT id FROM new_order) as id,
        (SELECT order_id FROM new_order) as order_code;
    `, [userId, guestId]);

    const row = result.rows[0];

    if (!row?.id) {
      throw new Error("Thanh toán thất bại: Giỏ hàng trống hoặc hết hàng.");
    }

    revalidatePath('/cart');
    revalidatePath('/orders');

    return { 
      success: true, 
      orderId: row.id,          // UUID (internal)
      orderCode: row.order_code // ORD-xxxx (hiển thị cho user)
    };

  } catch (err: any) {
    console.error("Checkout SQL Error:", err.message);
    return { 
      success: false, 
      error: err.message || "Lỗi hệ thống khi thanh toán" 
    };
  } finally {
    client.release();
  }
}






