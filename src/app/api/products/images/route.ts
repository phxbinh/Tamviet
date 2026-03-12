
// src/app/api/products/images/route.ts
import { sql } from "@/lib/neon/sql"

export async function POST(req: Request) {

  const { productId, variantId, paths } = await req.json()

  if (!Array.isArray(paths) || paths.length === 0) {
    return new Response("Invalid paths", { status: 400 })
  }

  if (!productId && !variantId) {
    return new Response("Missing productId or variantId", { status: 400 })
  }

  const rows = await sql`
    insert into product_images (
      product_id,
      variant_id,
      image_url
    )
    select
      ${productId ?? null},
      ${variantId ?? null},
      p
    from unnest(${paths}::text[]) as p
    returning id
  `

  return Response.json({
    ok: true,
    inserted: rows.length
  })
}