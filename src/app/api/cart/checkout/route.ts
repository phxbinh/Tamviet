// app/api/checkout/route.ts
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