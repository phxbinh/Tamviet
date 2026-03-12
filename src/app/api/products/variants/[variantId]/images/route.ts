import { sql } from "@/lib/neon/sql"

export async function GET(
  req: Request,
  context: { params: Promise<{ variantId: string }> }
) {
  const { variantId } = await context.params

  const rows = await sql`
    select
      id,
      image_url,
      alt_text,
      display_order,
      is_thumbnail
    from product_images
    where variant_id = ${variantId}
      and is_active = true
    order by display_order
  `

  return Response.json(rows)
}