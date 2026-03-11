//src/app/api/admin/attribute-values/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

// GET: list theo attribute_id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const attributeId = searchParams.get("attributeId");

  if (!attributeId) {
    return NextResponse.json(
      { error: "attributeId is required" },
      { status: 400 }
    );
  }

  const rows = await sql`
    select *
    from attribute_values
    where attribute_id = ${attributeId}
    order by sort_order asc, value asc
  `;

  return NextResponse.json(rows);
}

// POST: create
export async function POST(req: Request) {
  const body = await req.json();
  const { attribute_id, value, sort_order = 0 } = body;

  if (!attribute_id || !value) {
    return NextResponse.json(
      { error: "attribute_id and value are required" },
      { status: 400 }
    );
  }

  try {
    const rows = await sql`
      insert into attribute_values (attribute_id, value, sort_order)
      values (${attribute_id}, ${value.trim()}, ${sort_order})
      returning *
    `;

    return NextResponse.json(rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Duplicate value for this attribute" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create attribute value" },
      { status: 500 }
    );
  }
}