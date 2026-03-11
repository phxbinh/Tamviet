// src/app/api/admin/product-variants/[id]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await req.json();

    const {
      sku,
      title,
      price,
      compare_at_price,
      stock,
      allow_backorder,
      is_active,
      attribute_value_ids,
    } = body;

    await sql`BEGIN`;

    // 1️⃣ Get existing variant
    const existingRows = await sql`
      select product_id
      from product_variants
      where id = ${id}
      for update
    `;

    if (existingRows.length === 0) {
      await sql`ROLLBACK`;
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    const product_id = existingRows[0].product_id;

    let newCombinationKey: string | null = null;

    // 2️⃣ Nếu update attribute
    if (Array.isArray(attribute_value_ids)) {
      if (attribute_value_ids.length === 0) {
        throw new Error("attribute_value_ids cannot be empty");
      }

      newCombinationKey = [...new Set(attribute_value_ids)]
        .sort()
        .join(".");

      // update combination_key trước (unique check sẽ chạy)
      await sql`
        update product_variants
        set combination_key = ${newCombinationKey}
        where id = ${id}
      `;

      // delete old mapping
      await sql`
        delete from variant_attribute_values
        where variant_id = ${id}
      `;

      // insert new mapping
      for (const valueId of attribute_value_ids) {
        await sql`
          insert into variant_attribute_values (
            variant_id,
            attribute_value_id
          )
          values (${id}, ${valueId})
        `;
      }
    }

    // 3️⃣ Update các field còn lại (partial update)
    await sql`
      update product_variants
      set
        sku = coalesce(${sku}, sku),
        title = coalesce(${title}, title),
        price = coalesce(${price}, price),
        compare_at_price = coalesce(${compare_at_price}, compare_at_price),
        stock = coalesce(${stock}, stock),
        allow_backorder = coalesce(${allow_backorder}, allow_backorder),
        is_active = coalesce(${is_active}, is_active),
        updated_at = now()
      where id = ${id}
    `;

    await sql`COMMIT`;

    return NextResponse.json({ success: true });

  } catch (err: any) {
    await sql`ROLLBACK`;

    if (err?.code === "23505") {
      return NextResponse.json(
        { error: "Duplicate variant combination or SKU" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to update variant" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const rows = await sql`
      delete from product_variants
      where id = ${id}
      returning id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (err) {
    console.error("Delete variant error:", err);

    return NextResponse.json(
      { error: "Failed to delete variant" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const rows = await sql`
      select *
      from product_variants
      where id = ${id}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch variant" },
      { status: 500 }
    );
  }
}