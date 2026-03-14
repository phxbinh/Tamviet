// src/app/api/admin/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

/*
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
*/


export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const rows = await sql`
    select
      id,
      parent_id,
      name,
      slug,
      category_path,
      category_depth,
      is_active,
      display_order,
      created_at,
      updated_at
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

  // lấy category cũ
  const old = await sql`
    select category_path, category_depth
    from categories
    where id = ${id}
    limit 1
  `;

  if (!old.length) {
    return NextResponse.json(
      { success: false, error: "Category not found" },
      { status: 404 }
    );
  }

  const oldPath = old[0].category_path;

  let newPath = slug;
  let newDepth = 0;

  // nếu có parent
  if (parent_id) {

    const parent = await sql`
      select category_path, category_depth
      from categories
      where id = ${parent_id}
      limit 1
    `;

    if (!parent.length) {
      return NextResponse.json(
        { success: false, error: "Parent category not found" },
        { status: 400 }
      );
    }

    newPath = `${parent[0].category_path}/${slug}`;
    newDepth = parent[0].category_depth + 1;
  }

  // update category
  const rows = await sql`
    update categories
    set
      name = ${name},
      slug = ${slug},
      parent_id = ${parent_id ?? null},
      category_path = ${newPath},
      category_depth = ${newDepth},
      display_order = ${display_order ?? 0},
      is_active = ${is_active}
    where id = ${id}
    returning *
  `;

  // update toàn bộ children path
  await sql`
    update categories
    set category_path =
      ${newPath} || substring(category_path from length(${oldPath}) + 1)
    where category_path like ${oldPath + '/%'}
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

  const children = await sql`
    select id
    from categories
    where parent_id = ${id}
    limit 1
  `;

  if (children.length) {
    return NextResponse.json(
      { success:false, error:"Category has children" },
      { status:400 }
    );
  }

  await sql`
    delete from categories
    where id = ${id}
  `;

  return NextResponse.json({
    success:true
  });
}







