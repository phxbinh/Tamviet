import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET() {
  try {
    const rows = await sql`
      select
        id,
        parent_id,
        name,
        slug,
        is_active,
        display_order,
        created_at,
        updated_at
      from categories
      order by display_order, name
    `;

    return NextResponse.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      parent_id,
      display_order,
      is_active
    } = body;

    const rows = await sql`
      insert into categories (
        name,
        slug,
        parent_id,
        display_order,
        is_active
      )
      values (
        ${name},
        ${slug},
        ${parent_id ?? null},
        ${display_order ?? 0},
        ${is_active ?? true}
      )
      returning *
    `;

    return NextResponse.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Create category failed" },
      { status: 500 }
    );
  }
}








