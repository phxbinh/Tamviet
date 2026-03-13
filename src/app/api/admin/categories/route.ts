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