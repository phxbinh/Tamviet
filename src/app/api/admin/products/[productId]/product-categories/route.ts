import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;

  const rows = await sql`
    select
      c.id,
      c.name,
      c.parent_id,
      c.slug,
      pc.product_id is not null as selected
    from categories c
    left join product_categories pc
      on pc.category_id = c.id
      and pc.product_id = ${productId}
    order by c.display_order, c.name
  `;

  return NextResponse.json({
    success: true,
    data: rows
  });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {

  const { productId } = await context.params;

  const body = await req.json();

  const { category_ids } = body;

  await sql`delete from product_categories where product_id = ${productId}`;

  if (category_ids?.length) {

    await sql`
      insert into product_categories (product_id, category_id)
      select ${productId}, unnest(${category_ids}::uuid[])
    `;

  }

  return NextResponse.json({
    success: true
  });

}
