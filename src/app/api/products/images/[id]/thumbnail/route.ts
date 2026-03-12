import { sql } from "@/lib/neon/sql"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params

  const rows = await sql`
    select product_id, variant_id
    from product_images
    where id = ${id}
  `

  if (rows.length === 0) {
    return new Response("Not found", { status: 404 })
  }

  const img = rows[0]

  if (img.product_id) {

    await sql`
      update product_images
      set is_thumbnail = false
      where product_id = ${img.product_id}
    `

    await sql`
      update product_images
      set is_thumbnail = true
      where id = ${id}
    `

  // cập nhật thumbnail_url trong bảng products
  await sql`
    update products
    set thumbnail_url = (
      select image_url
      from product_images
      where id = ${id}
    )
    where id = ${img.product_id}
  `


  } else {

    await sql`
      update product_images
      set is_thumbnail = false
      where variant_id = ${img.variant_id}
    `

    await sql`
      update product_images
      set is_thumbnail = true
      where id = ${id}
    `

  }

  return Response.json({ ok: true })
}