"use server"
import { revalidatePath } from "next/cache";
import { updateCartItem, removeCartItem } from "@/lib/cart/sqlCart";

export async function updateCartAction(formData: FormData) {
  const variantId = formData.get("variantId") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  if (!variantId || isNaN(quantity)) return;

  await updateCartItem({variantId, quantity});
  revalidatePath("/cart"); 
}

export async function removeCartItemAction(formData: FormData) {
  const variantId = formData.get("variantId") as string;
  if (!variantId) return;

  await removeCartItem(variantId);
  revalidatePath("/cart");
}
