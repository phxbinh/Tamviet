// lib/actions/checkout-action.ts
export async function checkoutAction(shippingData: ShippingAddress) {
  // 1. Lấy identity (Bảo mật như cũ)
  const identity = await getCartIdentity();
  const userId = identity.userId ?? null;
  const guestId = identity.guestId ?? null;

  const client = await pool.connect();

  try {
    // DÙNG CTE ĐỂ LƯU CẢ ORDER VÀ ADDRESS TRONG 1 LẦN GỌI
    const result = await client.query(`
      WITH target_cart AS (
        SELECT id FROM carts 
        WHERE status = 'active' AND ((user_id = $1 AND $1 IS NOT NULL) OR (guest_id = $2 AND $2 IS NOT NULL))
        LIMIT 1
      ),
      check_items AS (
        SELECT ci.variant_id, ci.quantity, pv.price, pv.stock
        FROM cart_items ci
        JOIN product_variants pv ON pv.id = ci.variant_id
        WHERE ci.cart_id = (SELECT id FROM target_cart)
        FOR UPDATE
      ),
      new_order AS (
        INSERT INTO orders (user_id, guest_id, total_price, status)
        SELECT $1, $2, SUM(price * quantity), 'pending'
        FROM check_items
        RETURNING id
      ),
      -- INSERT VÀO BẢNG ORDER_ADDRESSES MỚI NÂNG CẤP
      insert_address AS (
        INSERT INTO order_addresses (
          order_id, user_id, guest_id,
          full_name, phone, email,
          address_line1, address_line2,
          province_name, district_name, ward_name,
          province_id, district_id, ward_code,
          country, postal_code
        )
        SELECT 
          (SELECT id FROM new_order), $1, $2,
          $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ),
      move_items AS (
        INSERT INTO order_items (order_id, variant_id, quantity, price_at_time)
        SELECT (SELECT id FROM new_order), variant_id, quantity, price FROM check_items
      ),
      reduce_stock AS (
        UPDATE product_variants pv SET stock = pv.stock - ci.quantity
        FROM check_items ci WHERE pv.id = ci.variant_id
      ),
      clear_cart AS (
        DELETE FROM cart_items WHERE cart_id = (SELECT id FROM target_cart)
      )
      UPDATE carts SET status = 'checked_out', updated_at = now()
      WHERE id = (SELECT id FROM target_cart)
      RETURNING (SELECT id FROM new_order) as order_id;
    `, [
      userId, guestId,                         // $1, $2
      shippingData.full_name,                  // $3
      shippingData.phone,                      // $4
      shippingData.email || null,              // $5
      shippingData.address_line1,              // $6
      shippingData.address_line2 || null,      // $7
      shippingData.province_name,              // $8
      shippingData.district_name,              // $9
      shippingData.ward_name,                  // $10
      shippingData.province_id,                // $11
      shippingData.district_id,                // $12
      shippingData.ward_code,                  // $13
      shippingData.country,                    // $14
      shippingData.postal_code || null         // $15
    ]);

    const orderId = result.rows[0]?.order_id;
    return { success: true, orderId };
    
  } catch (err: any) {
    return { success: false, error: err.message };
  } finally {
    client.release();
  }
}
