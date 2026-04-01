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
import { checkout } from "@/lib/cart/checkout";
import { getCartIdentity } from "@/lib/cart/sqlCart"; // Import hàm bạn đã tạo

export async function POST() {
  // 1. Lấy danh tính (userId hoặc guestId từ cookie)
  const identity = await getCartIdentity();

  // 2. Kiểm tra xem có định danh nào không (phòng trường hợp lỗi cookie)
  if (!identity.userId && !identity.guestId) {
    return Response.json({ error: "Không tìm thấy thông tin giỏ hàng" }, { status: 400 });
  }

  // 3. Truyền identity vào hàm checkout
  // Hàm checkout của bạn cần cập nhật để nhận { userId?: string, guestId?: string }
  const result = await checkout(identity);

  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result);
}
