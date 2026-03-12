// src/app/api/products/images/route.ts
import { sql } from "@/lib/neon/sql"
import { supabase } from '@/lib/supabase/clientSupabase';

import { supabaseServer } from '@/lib/supabase/server';


/*
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
*/




export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  // 1️⃣ lấy path ảnh
  const images = await sql`
    select image_url
    from product_images
    where id = ${id}
  `

  if (images.length === 0) {
    return Response.json({ error: "Image not found" }, { status: 404 })
  }

  const imagePath = images[0].image_url

  // 2️⃣ xoá file trong storage
  const { error } = await supabaseServer.storage
    .from("products-images")
    .remove([imagePath])

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // 3️⃣ xoá record DB
  await sql`
    delete from product_images
    where id = ${id}
  `

  return Response.json({ ok: true })
}