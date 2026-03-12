import { sql } from "@/lib/neon/sql"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { productId, variantId } = await req.json()

  if (!productId && !variantId) {
    return new Response("Missing productId or variantId", { status: 400 })
  }

/*
  // kiểm tra quyền admin
  const admin = await sql`
    select role
    from users
    where id = ${user.id}
  `

  if (admin.length === 0 || admin[0].role !== 'admin') {
    return new Response("Forbidden", { status: 403 })
  }
*/

  // kiểm tra product tồn tại
  if (productId) {

    const rows = await sql`
      select 1
      from products
      where id = ${productId}
    `

    if (rows.length === 0) {
      return new Response("Product not found", { status: 404 })
    }

  }

  // kiểm tra variant tồn tại
  if (variantId) {

    const rows = await sql`
      select 1
      from product_variants
      where id = ${variantId}
    `

    if (rows.length === 0) {
      return new Response("Variant not found", { status: 404 })
    }

  }

  return Response.json({ ok: true })
}