import { NextResponse } from "next/server";
import { addToCart, updateCartItem, removeCartItem, getCart } from "@/lib/cart/sqlCart";

export async function GET() {
  const data = await getCart();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  await addToCart({
    variantId: body.variantId,
    quantity: body.quantity || 1,
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const body = await req.json();

  await updateCartItem({
    variantId: body.variantId,
    quantity: body.quantity,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();

  await removeCartItem(body.variantId);

  return NextResponse.json({ success: true });
}