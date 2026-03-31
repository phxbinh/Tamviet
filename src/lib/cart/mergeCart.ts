import { sqlApp } from "@/lib/neon/sql";

export async function mergeCart({
  userId,
  guestId,
}: {
  userId: string;
  guestId: string;
}) {
  if (!guestId) return;

  await sqlApp.transaction(async (tx) => {
    // 🔑 set context user cho RLS
    await tx`SELECT set_config('app.user_id', ${userId}, true)`;

    // 1. guest cart
    const guestCart = await tx`
      SELECT id FROM carts
      WHERE guest_id = ${guestId}
      AND status = 'active'
      LIMIT 1
    `;

    if (guestCart.length === 0) return;

    const guestCartId = guestCart[0].id;

    // 2. user cart
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

    const userCartId = userCart[0].id;

    // 🔥 3. MERGE ITEMS (CORE)
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

    // 4. delete guest items
    await tx`
      DELETE FROM cart_items
      WHERE cart_id = ${guestCartId}
    `;

    // 5. delete guest cart
    await tx`
      DELETE FROM carts
      WHERE id = ${guestCartId}
    `;
  });
}