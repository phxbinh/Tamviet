"use server";

import { sql } from "@/lib/neon/sql";

export async function auditCartAndOrders() {
  // ========================
  // 🛒 CART CHECKS
  // ========================

  const cartsWithoutItems = await sql`
    SELECT c.id
    FROM carts c
    LEFT JOIN cart_items ci ON ci.cart_id = c.id
    WHERE ci.id IS NULL
      AND c.status = 'active'
  `;

  const duplicateUserCarts = await sql`
    SELECT user_id, COUNT(*) 
    FROM carts
    WHERE status = 'active' AND user_id IS NOT NULL
    GROUP BY user_id
    HAVING COUNT(*) > 1
  `;

  const duplicateGuestCarts = await sql`
    SELECT guest_id, COUNT(*) 
    FROM carts
    WHERE status = 'active' AND guest_id IS NOT NULL
    GROUP BY guest_id
    HAVING COUNT(*) > 1
  `;

  const invalidCartItems = await sql`
    SELECT id, quantity
    FROM cart_items
    WHERE quantity <= 0
  `;

  // ========================
  // 📦 ORDER CHECKS
  // ========================

  const ordersWithoutItems = await sql`
    SELECT o.id
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE oi.id IS NULL
  `;

  // ❗ Check total_price mismatch
  const wrongTotalOrders = await sql`
    SELECT 
      o.id,
      o.total_price,
      SUM(oi.price_at_time * oi.quantity) as computed_total
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    HAVING o.total_price <> SUM(oi.price_at_time * oi.quantity)
  `;

  const invalidOrderItems = await sql`
    SELECT id, quantity
    FROM order_items
    WHERE quantity <= 0
  `;

  const ordersWithoutAddress = await sql`
    SELECT o.id
    FROM orders o
    LEFT JOIN order_addresses oa ON oa.order_id = o.id
    WHERE oa.id IS NULL
  `;

  const paymentMismatch = await sql`
    SELECT 
      o.id,
      o.total_price,
      SUM(op.amount) as paid
    FROM orders o
    LEFT JOIN order_payments op ON op.order_id = o.id
    GROUP BY o.id
    HAVING COALESCE(SUM(op.amount), 0) <> o.total_price
  `;

  // ========================
  // 📊 RESULT
  // ========================

  return {
    carts: {
      cartsWithoutItems,
      duplicateUserCarts,
      duplicateGuestCarts,
      invalidCartItems,
    },
    orders: {
      ordersWithoutItems,
      wrongTotalOrders,
      invalidOrderItems,
      ordersWithoutAddress,
      paymentMismatch,
    },
  };
}