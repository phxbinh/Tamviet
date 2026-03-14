// src/app/api/admin/categories/tree/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

/*
export async function GET() {

  const rows = await sql`
    select
      id,
      name,
      parent_id
    from categories
    order by display_order asc, name asc
  `;

  return NextResponse.json({
    success: true,
    data: rows
  });
}
*/

// src/app/api/admin/categories/tree/route.ts
export async function GET() {
  try {

    const rows = await sql`
      select
        id,
        name,
        parent_id,
        category_depth
      from categories
      order by category_path
    `;

    return NextResponse.json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { success:false, error:"Failed to fetch category tree" },
      { status:500 }
    )
  }
}
