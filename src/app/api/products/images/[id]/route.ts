// src/app/api/products/images/route.ts
import { sql } from "@/lib/neon/sql"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params

  await sql`
    delete from product_images
    where id = ${id}
  `

  return Response.json({ ok: true })
}