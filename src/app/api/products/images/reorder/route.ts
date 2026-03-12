import { sql } from "@/lib/neon/sql"

export async function PATCH(req: Request) {

  const { images } = await req.json()

  if (!Array.isArray(images)) {
    return new Response("Invalid data", { status: 400 })
  }

  for (const img of images) {

    await sql`
      update product_images
      set display_order = ${img.order}
      where id = ${img.id}
    `
  }

  return Response.json({ ok: true })
}