// app/api/checkout/route.ts
/* Dùng cho user có tài khoản 
import { checkout } from "@/lib/cart/checkout";
import { getCurrentUser } from "@/lib/authActions/getUser";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await checkout({ userId: user.id });

  return Response.json(result);
}
*/

// app/api/checkout/route.ts
// app/api/cart/checkout/route.ts
import { checkout } from "@/lib/cart/checkout";
import { getCartIdentity } from "@/lib/cart/sqlCart"; // Import hàm bạn đã tạo
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 1. Lấy định danh (đã xử lý logic User/Guest bên trong)
    const identity = await getCartIdentity();

    /**
     * FIX LỖI TYPE: 
     * Chuyển đổi 'null' từ CartIdentity thành 'undefined' để khớp tham số 
     * { userId?: string; guestId?: string } của hàm checkout.
     */
    const result = await checkout({
      userId: identity.userId ?? undefined,
      guestId: identity.guestId ?? undefined,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Checkout Error:", err.message);
    
    // Trả về lỗi cụ thể (ví dụ: Out of stock, Cart empty) để UI hiển thị
    return NextResponse.json(
      { error: err.message || "Thanh toán thất bại" },
      { status: 400 }
    );
  }
}

