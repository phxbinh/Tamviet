//import { cookies } from "next/headers";
//import { getUser } from "@/lib/auth"; // supabase
//import { getCurrentUser } from '@/lib/authActions/getUser';

import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

/* =========================
   TYPE (PHẢI MATCH sqlCart)
========================= */

export type CartIdentity =
  | { userId: string; guestId?: null }
  | { userId?: null; guestId: string };

/* =========================
   GET IDENTITY
========================= */

export async function getCartIdentity(): Promise<CartIdentity> {
  const user = await getCurrentUser();

  // ✅ USER
  if (user) {
    return {
      userId: user.id,
      guestId: null,
    };
  }

  // ✅ GUEST
  const cookieStore = await cookies();

  let guestId = cookieStore.get("guest_id")?.value;

  if (!guestId) {
    guestId = crypto.randomUUID();

    cookieStore.set("guest_id", guestId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax", // ✅ chống CSRF cơ bản
    });
  }

  return {
    userId: null,
    guestId,
  };
}



import { sql } from "@/lib/neon/sql";
//import { getCartIdentity } from "./getCartIdentity";

/* =========================
   TYPES
========================= */

/*
type CartIdentity =
  | { userId: string; guestId?: null }
  | { userId?: null; guestId: string };
*/

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

  const carts = await sql<CartRow[]>`
    select * from carts
    where status = 'active'
    and (
      (${userId}::uuid is not null and user_id = ${userId})
      or
      (${guestId}::text is not null and guest_id = ${guestId})
    )
    limit 1
  `;

  if (carts.length > 0) return carts[0];

  const newCart = await sql<CartRow[]>`
    insert into carts (user_id, guest_id)
    values (${userId}, ${guestId})
    returning *
  `;

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
    insert into cart_items (cart_id, variant_id, quantity)
    values (${cart.id}, ${variantId}, ${quantity})
    on conflict (cart_id, variant_id)
    do update set 
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
      delete from cart_items
      where cart_id = ${cart.id}
      and variant_id = ${variantId}
    `;
    return;
  }

  await sql`
    update cart_items
    set quantity = ${quantity},
        updated_at = now()
    where cart_id = ${cart.id}
    and variant_id = ${variantId}
  `;
}

/* =========================
   REMOVE ITEM
========================= */

export async function removeCartItem(variantId: string) {
  const identity = await getCartIdentity();
  const cart = await getOrCreateCart(identity);

  await sql`
    delete from cart_items
    where cart_id = ${cart.id}
    and variant_id = ${variantId}
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

  const items = await sql<CartItemRow[]>`
    select 
      ci.quantity,
      pv.id as variant_id,
      pv.price,
      pv.stock,
      p.name,
      p.slug
    from cart_items ci
    join product_variants pv on pv.id = ci.variant_id
    join products p on p.id = pv.product_id
    where ci.cart_id = ${cart.id}
  `;

  return {
    cartId: cart.id,
    items,
  };
}









