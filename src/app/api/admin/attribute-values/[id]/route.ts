//src/app/api/admin/attribute-values/[id]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

// UPDATE
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const { value, sort_order = 0 } = body;

  if (!value) {
    return NextResponse.json(
      { error: "value is required" },
      { status: 400 }
    );
  }

  try {
    const rows = await sql`
      update attribute_values
      set value = ${value.trim()},
          sort_order = ${sort_order},
          updated_at = now()
      where id = ${id}
      returning *
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Duplicate value for this attribute" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update attribute value" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const rows = await sql`
    delete from attribute_values
    where id = ${id}
    returning id
  `;

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}