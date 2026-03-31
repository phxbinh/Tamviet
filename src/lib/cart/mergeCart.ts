import { sql } from "@/lib/neon/sql";

export async function mergeCart({
  userId,
  guestId,
}: {
  userId: string;
  guestId: string;
}) {
  if (!guestId) return;

  return await sql.transaction(async (tx) => {
    // 1. lấy guest cart
    const guestCart = await tx`
      SELECT id FROM carts
      WHERE guest_id = ${guestId}
      AND status = 'active'
      LIMIT 1
    `;

    if (guestCart.length === 0) return;

    // 2. lấy hoặc tạo user cart
    let userCart = await tx`
      SELECT id FROM carts
      WHERE user_id = ${userId}
      AND status = 'active'
      LIMIT 1
    `;

    if (userCart.length === 0) {
      userCart = await tx`
        INSERT INTO carts (user_id)
        VALUES (${userId})
        RETURNING id
      `;
    }

    const guestCartId = guestCart[0].id;
    const userCartId = userCart[0].id;

    // 3. MERGE ITEMS (QUAN TRỌNG NHẤT)
    await tx`
      INSERT INTO cart_items (cart_id, variant_id, quantity)
      SELECT
        ${userCartId},
        variant_id,
        quantity
      FROM cart_items
      WHERE cart_id = ${guestCartId}
      ON CONFLICT (cart_id, variant_id)
      DO UPDATE SET
        quantity = cart_items.quantity + EXCLUDED.quantity,
        updated_at = now()
    `;

    // 4. xoá guest cart items
    await tx`
      DELETE FROM cart_items
      WHERE cart_id = ${guestCartId}
    `;

    // 5. xoá guest cart
    await tx`
      DELETE FROM carts
      WHERE id = ${guestCartId}
    `;
  });
}