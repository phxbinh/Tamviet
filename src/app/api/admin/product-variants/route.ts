// src/app/api/admin/product-variants/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function POST(req: Request) {
  let clientError = false;

  try {
    const body = await req.json();

    const {
      product_id,
      sku = null,
      title = null,
      price,
      compare_at_price = null,
      stock = 0,
      allow_backorder = false,
      is_active = true,
      attribute_value_ids,
    } = body;

    // 🔥 1️⃣ Validate input
    if (!product_id) {
      clientError = true;
      throw new Error("product_id is required");
    }

    if (price === undefined || price === null) {
      clientError = true;
      throw new Error("price is required");
    }

    if (!Array.isArray(attribute_value_ids) || attribute_value_ids.length === 0) {
      clientError = true;
      throw new Error("attribute_value_ids must not be empty");
    }

    if (Number(price) < 0) {
      clientError = true;
      throw new Error("price must be >= 0");
    }

    if (Number(stock) < 0) {
      clientError = true;
      throw new Error("stock must be >= 0");
    }

    if (
      compare_at_price !== null &&
      Number(compare_at_price) < Number(price)
    ) {
      clientError = true;
      throw new Error("compare_at_price must be >= price");
    }

    // 🔥 2️⃣ Build deterministic combination_key
    const combination_key = [...new Set(attribute_value_ids)]
      .sort()
      .join(".");

    // 🔥 3️⃣ Transaction
    await sql`BEGIN`;

    // 3.1 Insert variant
    const variantRows = await sql`
      insert into product_variants (
        product_id,
        sku,
        title,
        price,
        compare_at_price,
        stock,
        allow_backorder,
        is_active,
        combination_key
      )
      values (
        ${product_id},
        ${sku},
        ${title},
        ${price},
        ${compare_at_price},
        ${stock},
        ${allow_backorder},
        ${is_active},
        ${combination_key}
      )
      returning *
    `;

    const variant = variantRows[0];

    // 3.2 Insert mapping
    for (const valueId of attribute_value_ids) {
      await sql`
        insert into variant_attribute_values (
          variant_id,
          attribute_value_id
        )
        values (${variant.id}, ${valueId})
      `;
    }

    await sql`COMMIT`;

    return NextResponse.json(variant, { status: 201 });

  } catch (err: any) {

    try {
      await sql`ROLLBACK`;
    } catch {}

    // 🔥 Unique violation
    if (err?.code === "23505") {
      return NextResponse.json(
        { error: "Duplicate variant combination or SKU" },
        { status: 409 }
      );
    }

    // 🔥 Client validation error
    if (err instanceof Error && err.message && err.message.includes("required")) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }

    if (clientError) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }

    console.error("Create variant error:", err);

    return NextResponse.json(
      { error: "Failed to create variant" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  try {
    const rows = await sql`
      select
        v.id,
        v.sku,
        v.title,
        v.price,
        v.compare_at_price,
        v.stock,
        v.allow_backorder,
        v.is_active,
        v.created_at,
        v.updated_at,

        coalesce(
          json_agg(
            json_build_object(
              'attribute_name', a.name,
              'value', av.value
            )
          ) filter (where av.id is not null),
          '[]'
        ) as raw_attributes

      from product_variants v
      left join variant_attribute_values vav
        on vav.variant_id = v.id
      left join attribute_values av
        on av.id = vav.attribute_value_id
      left join attributes a
        on a.id = av.attribute_id

      where v.product_id = ${productId}

      group by v.id
      order by v.created_at asc
    `;

    // 🔥 reshape
    const result = rows.map((row) => {
      const attributesObject: Record<string, string> = {};

      for (const attr of row.raw_attributes) {
        attributesObject[attr.attribute_name] = attr.value;
      }

      return {
        ...row,
        attributes: attributesObject,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch variants" },
      { status: 500 }
    );
  }
}









