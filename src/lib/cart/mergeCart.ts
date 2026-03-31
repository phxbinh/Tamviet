import { sqlApp } from "@/lib/neon/sql";

export async function mergeCart({
  userId,
  guestId,
}: {
  userId: string;
  guestId: string;
}) {
  if (!guestId) return;

  await sqlApp.transaction((tx) => [
    // 🔑 set context RLS
    tx`SELECT set_config('app.user_id', ${userId}, true)`,

    // 1. lấy guest cart
    tx`
      WITH guest_cart AS (
        SELECT id FROM carts
        WHERE guest_id = ${guestId}
        AND status = 'active'
        LIMIT 1
      ),
      user_cart AS (
        INSERT INTO carts (user_id)
        SELECT ${userId}
        WHERE NOT EXISTS (
          SELECT 1 FROM carts
          WHERE user_id = ${userId}
          AND status = 'active'
        )
        RETURNING id
      ),
      final_user_cart AS (
        SELECT id FROM user_cart
        UNION
        SELECT id FROM carts
        WHERE user_id = ${userId}
        AND status = 'active'
        LIMIT 1
      )

      INSERT INTO cart_items (cart_id, variant_id, quantity)
      SELECT
        (SELECT id FROM final_user_cart),
        ci.variant_id,
        ci.quantity
      FROM cart_items ci
      WHERE ci.cart_id = (SELECT id FROM guest_cart)

      ON CONFLICT (cart_id, variant_id)
      DO UPDATE SET
        quantity = cart_items.quantity + EXCLUDED.quantity,
        updated_at = now()
    `,

    // 2. delete guest items
    tx`
      DELETE FROM cart_items
      WHERE cart_id IN (
        SELECT id FROM carts
        WHERE guest_id = ${guestId}
        AND status = 'active'
      )
    `,

    // 3. delete guest cart
    tx`
      DELETE FROM carts
      WHERE guest_id = ${guestId}
      AND status = 'active'
    `,
  ]);
}