import { cookies } from "next/headers";
import { getUser } from "@/lib/auth"; // supabase

export async function getCartIdentity() {
  const user = await getUser();

  if (user) {
    return {
      type: "user",
      userId: user.id,
      guestId: null,
    };
  }

  const cookieStore = cookies();
  let guestId = cookieStore.get("guest_id")?.value;

  if (!guestId) {
    guestId = crypto.randomUUID();

    cookieStore.set("guest_id", guestId, {
      httpOnly: true,
      path: "/",
    });
  }

  return {
    type: "guest",
    userId: null,
    guestId,
  };
}


import { sql } from "@/lib/neon/sql";

export async function getOrCreateCart(identity) {
  const { userId, guestId } = identity;

  let cart = await sql`
    select * from carts
    where status = 'active'
    and (
      (${userId}::uuid is not null and user_id = ${userId})
      or
      (${guestId}::text is not null and guest_id = ${guestId})
    )
    limit 1
  `;

  if (cart.length > 0) return cart[0];

  const newCart = await sql`
    insert into carts (user_id, guest_id)
    values (${userId}, ${guestId})
    returning *
  `;

  return newCart[0];
}


// Add to cart
export async function addToCart({ variantId, quantity }) {
  const identity = await getCartIdentity();
  const cart = await getOrCreateCart(identity);

  await sql`
    insert into cart_items (cart_id, variant_id, quantity)
    values (${cart.id}, ${variantId}, ${quantity})
    on conflict (cart_id, variant_id)
    do update set quantity = cart_items.quantity + ${quantity},
                  updated_at = now()
  `;

  return cart.id;
}

// Update quantity
export async function updateCartItem({ variantId, quantity }) {
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

// Remove Items
export async function removeCartItem(variantId: string) {
  const identity = await getCartIdentity();
  const cart = await getOrCreateCart(identity);

  await sql`
    delete from cart_items
    where cart_id = ${cart.id}
    and variant_id = ${variantId}
  `;
}

// Get full data cart
export async function getCart() {
  const identity = await getCartIdentity();
  const cart = await getOrCreateCart(identity);

  const items = await sql`
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









