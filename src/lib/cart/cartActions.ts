// actions/cartActions.ts
"use server";
import { addToCart, getCartAllItems_ } from "./sqlCart"; // Đường dẫn file số 3 của bạn
import { revalidatePath } from "next/cache";

export async function addToCartAction(variantId: string, quantity: number) {
  try {
    await addToCart({ variantId, quantity });
    revalidatePath("/"); // Cập nhật lại toàn bộ cache các trang liên quan
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
