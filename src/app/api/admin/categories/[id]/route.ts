import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const rows = await sql`
    select *
    from categories
    where id = ${id}
    limit 1
  `;

  if (!rows.length) {
    return NextResponse.json(
      { success: false, error: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: rows[0]
  });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = await req.json();

  const {
    name,
    slug,
    parent_id,
    display_order,
    is_active
  } = body;

  const rows = await sql`
    update categories
    set
      name = ${name},
      slug = ${slug},
      parent_id = ${parent_id ?? null},
      display_order = ${display_order ?? 0},
      is_active = ${is_active}
    where id = ${id}
    returning *
  `;

  return NextResponse.json({
    success: true,
    data: rows[0]
  });
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await sql`
    delete from categories
    where id = ${id}
  `;

  return NextResponse.json({
    success: true
  });
}








