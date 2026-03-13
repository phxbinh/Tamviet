// src/app/api/admin/categories/tree/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

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