import { cookies } from "next/headers";
import { getCurrentUser } from "../authActions/getUser";

export type CartIdentity =
  | { userId: string; guestId?: null }
  | { userId?: null; guestId: string };

export async function getCartIdentity(): Promise<CartIdentity> {
  const user = await getCurrentUser();

  if (user) {
    return {
      userId: user.id,
      guestId: null,
    };
  }

  const cookieStore = await cookies();

  let guestId = cookieStore.get("guest_id")?.value;

  if (!guestId) {
    guestId = crypto.randomUUID();

    cookieStore.set("guest_id", guestId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
  }

  return {
    userId: null,
    guestId,
  };
}

import { sql } from "@/lib/neon/sql";
//import { getCartIdentity, CartIdentity } from "./getCartIdentity";

/* =========================
   TYPES
========================= */

type CartRow = {
  id: string;
  user_id: string | null;
  guest_id: string | null;
  status: string;
};

type CartItemRow = {
  quantity: number;
  variant_id: string;
  price: number;
  stock: number;
  name: string;
  slug: string;
};

/* =========================
   GET OR CREATE CART
========================= */

export async function getOrCreateCart(
  identity: CartIdentity
): Promise<CartRow> {
  const { userId, guestId } = identity;

  if (!userId && !guestId) {
    throw new Error("Missing cart identity");
  }

  let carts: CartRow[] = [];

  // ✅ FIX: tách logic ra JS
  if (userId) {
    carts = (await sql`
      SELECT *
      FROM carts
      WHERE status = 'active'
        AND user_id = ${userId}
      LIMIT 1
    `) as CartRow[];
  } else {
    carts = (await sql`
      SELECT *
      FROM carts
      WHERE status = 'active'
        AND guest_id = ${guestId}
      LIMIT 1
    `) as CartRow[];
  }

  if (carts.length > 0) return carts[0];

  const newCart = (await sql`
    INSERT INTO carts (user_id, guest_id)
    VALUES (${userId ?? null}, ${guestId ?? null})
    RETURNING *
  `) as CartRow[];

  return newCart[0];
}

/* =========================
   ADD TO CART
========================= */

export async function addToCart({
  variantId,
  quantity,
}: {
  variantId: string;
  quantity: number;
}) {
  if (quantity <= 0) return;

  const identity = await getCartIdentity();
  const cart = await getOrCreateCart(identity);

  await sql`
    INSERT INTO cart_items (cart_id, variant_id, quantity)
    VALUES (${cart.id}, ${variantId}, ${quantity})
    ON CONFLICT (cart_id, variant_id)
    DO UPDATE SET 
      quantity = cart_items.quantity + ${quantity},
      updated_at = now()
  `;

  return cart.id;
}

/* =========================
   UPDATE ITEM
========================= */

export async function updateCartItem({
  variantId,
  quantity,
}: {
  variantId: string;
  quantity: number;
}) {
  const identity = await getCartIdentity();
  const cart = await getOrCreateCart(identity);

  if (quantity <= 0) {
    await sql`
      DELETE FROM cart_items
      WHERE cart_id = ${cart.id}
      AND variant_id = ${variantId}
    `;
    return;
  }

  await sql`
    UPDATE cart_items
    SET quantity = ${quantity},
        updated_at = now()
    WHERE cart_id = ${cart.id}
    AND variant_id = ${variantId}
  `;
}

/* =========================
   REMOVE ITEM
========================= */

export async function removeCartItem(variantId: string) {
  const identity = await getCartIdentity();
  const cart = await getOrCreateCart(identity);

  await sql`
    DELETE FROM cart_items
    WHERE cart_id = ${cart.id}
    AND variant_id = ${variantId}
  `;
}

/* =========================
   GET FULL CART
========================= */

export async function getCart(): Promise<{
  cartId: string;
  items: CartItemRow[];
}> {
  const identity = await getCartIdentity();
  const cart = await getOrCreateCart(identity);

  const items = (await sql`
    SELECT 
      ci.quantity,
      pv.id as variant_id,
      pv.price,
      pv.stock,
      p.name,
      p.slug
    FROM cart_items ci
    JOIN product_variants pv ON pv.id = ci.variant_id
    JOIN products p ON p.id = pv.product_id
    WHERE ci.cart_id = ${cart.id}
  `) as CartItemRow[];

  return {
    cartId: cart.id,
    items,
  };
}

