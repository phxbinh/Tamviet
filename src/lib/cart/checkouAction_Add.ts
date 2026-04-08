// @/lib/actions/checkout.ts
'use server'
import { pool } from "@/lib/db/pg";
import { getCartIdentity } from "@/lib/cart/sqlCart";
import { CheckoutSchema, CheckoutInput } from "../typeInterfaces/orderAddress";
//src/lib/typeInterfaces/orderAddress.ts


/*
'use server'
import { pool } from "@/lib/db/pg";
import { getCartIdentity } from "@/lib/cart/sqlCart";
import { CheckoutSchema, CheckoutInput } from "../typeInterfaces/orderAddress";
*/

export async function checkoutAction(rawInput: CheckoutInput) {
  const validated = CheckoutSchema.safeParse(rawInput);
  if (!validated.success) {
    return { success: false, error: "Dữ liệu không hợp lệ" };
  }

  const data = validated.data;
  const { userId, guestId } = await getCartIdentity();
  const client = await pool.connect();

  try {
    const result = await client.query(`
      WITH 
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

      -- 🔥 THÊM validate stock (bạn đang thiếu)
      validate_stock AS (
        SELECT 1 FROM check_items WHERE stock < quantity
      ),

      -- 🔥 TẠO ORDER + order_id
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

      insert_address AS (
        INSERT INTO order_addresses (
          order_id, user_id, guest_id, full_name, phone, email,
          address_line1, province_id, province_name,
          district_id, district_name, ward_code, ward_name
        )
        SELECT 
          (SELECT id FROM new_order), 
          $1, $2, 
          $3, $4, $5, 
          $6, $7, $8, 
          $9, $10, $11, $12
        WHERE EXISTS (SELECT 1 FROM new_order)
      ),

      move_items AS (
        INSERT INTO order_items (
          order_id, variant_id, quantity, price_at_time
        )
        SELECT 
          (SELECT id FROM new_order), 
          variant_id, quantity, price
        FROM check_items
        WHERE EXISTS (SELECT 1 FROM new_order)
      ),

      reduce_stock AS (
        UPDATE product_variants pv 
        SET stock = pv.stock - ci.quantity
        FROM check_items ci 
        WHERE pv.id = ci.variant_id
        AND EXISTS (SELECT 1 FROM new_order)
      ),

      close_cart AS (
        UPDATE carts 
        SET status = 'checked_out', updated_at = now()
        WHERE id = (SELECT id FROM target_cart)
        AND EXISTS (SELECT 1 FROM new_order)
        RETURNING 1
      )

      -- 🔥 FINAL RETURN
      SELECT 
        (SELECT id FROM new_order) as id,
        (SELECT order_id FROM new_order) as order_code,
        (SELECT total_price FROM new_order) as total_price;
    `, [
      userId, 
      guestId, 
      data.full_name, 
      data.phone, 
      data.email || null,
      data.address_line1, 
      data.province_id, 
      data.province_name,
      data.district_id, 
      data.district_name, 
      data.ward_code, 
      data.ward_name
    ]);

    const row = result.rows[0];

    if (!row?.id) {
      throw new Error("Không thể tạo đơn hàng (Giỏ hàng trống hoặc hết hàng)");
    }

    return {
      success: true,
      orderId: row.id,           // UUID (internal)
      orderCode: row.order_code,  // ORD-xxxx (hiển thị)
      totalPrice: row.total_price
    };

  } catch (err: any) {
    console.error("SQL Error:", err);
    return { success: false, error: err.message };
  } finally {
    client.release();
  }
}











// Bản chạy được -----
//export 
async function checkoutAction__(rawInput: CheckoutInput) {
  // Validate lại ở Server cho chắc
  const validated = CheckoutSchema.safeParse(rawInput);
  if (!validated.success) return { success: false, error: "Dữ liệu không hợp lệ" };
  const data = validated.data;

  const { userId, guestId } = await getCartIdentity();
  const client = await pool.connect();

try {
    const result = await client.query(`
      WITH target_cart AS (
        SELECT id FROM carts 
        WHERE status = 'active' AND ((user_id = $1 AND $1 IS NOT NULL) OR (guest_id = $2 AND $2 IS NOT NULL))
        LIMIT 1
      ),
      check_items AS (
        SELECT ci.variant_id, ci.quantity, pv.price, pv.stock
        FROM cart_items ci JOIN product_variants pv ON pv.id = ci.variant_id
        WHERE ci.cart_id = (SELECT id FROM target_cart) FOR UPDATE
      ),
      new_order AS (
        INSERT INTO orders (user_id, guest_id, total_price, status)
        SELECT $1, $2, SUM(price * quantity), 'pending' FROM check_items
        RETURNING id
      ),
      insert_address AS (
        INSERT INTO order_addresses (
          order_id, user_id, guest_id, full_name, phone, email,
          address_line1, province_id, province_name, district_id, district_name, ward_code, ward_name
        ) SELECT (SELECT id FROM new_order), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ),
      move_items AS (
        INSERT INTO order_items (order_id, variant_id, quantity, price_at_time)
        SELECT (SELECT id FROM new_order), variant_id, quantity, price FROM check_items
      ),
      reduce_stock AS (
        UPDATE product_variants pv SET stock = pv.stock - ci.quantity
        FROM check_items ci WHERE pv.id = ci.variant_id
      ),
      close_cart AS (
        UPDATE carts SET status = 'checked_out', updated_at = now()
        WHERE id = (SELECT id FROM target_cart)
        RETURNING (SELECT id FROM new_order) as confirmed_id
      )
      -- LẤY DỮ LIỆU RA NGOÀI Ở ĐÂY
      SELECT confirmed_id as order_id FROM close_cart;
    `, [
      userId, guestId, data.full_name, data.phone, data.email || null,
      data.address_line1, data.province_id, data.province_name,
      data.district_id, data.district_name, data.ward_code, data.ward_name
    ]);

    // result.rows[0] bây giờ chắc chắn sẽ có order_id
    const orderId = result.rows[0]?.order_id;
    
    if (!orderId) throw new Error("Không thể tạo đơn hàng (Giỏ hàng trống hoặc lỗi kho)");

    return { success: true, orderId };
  } catch (err: any) {
    console.error("SQL Error:", err);
    return { success: false, error: err.message };
  } finally {
    client.release();
  }


}















