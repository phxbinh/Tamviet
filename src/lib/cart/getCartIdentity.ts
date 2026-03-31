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