// src/app/api/admin/products/[id]/variant-matrix/route.ts

import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const rows = await sql`
      select
        v.id as variant_id,
        v.sku,
        v.price,
        v.stock,
        a.name as attribute_name,
        av.value as attribute_value
      from product_variants v
      join variant_attribute_values vav
        on vav.variant_id = v.id
      join attribute_values av
        on av.id = vav.attribute_value_id
      join attributes a
        on a.id = av.attribute_id
      where v.product_id = ${id}
      and v.is_active = true
      order by v.created_at, a.name
    `;

    const map = new Map();

    for (const row of rows) {
      if (!map.has(row.variant_id)) {
        map.set(row.variant_id, {
          variant_id: row.variant_id,
          sku: row.sku,
          price: row.price,
          stock: row.stock,
          attributes: {},
        });
      }

      map.get(row.variant_id).attributes[row.attribute_name] =
        row.attribute_value;
    }

    return NextResponse.json(Array.from(map.values()));
  } catch (err) {
    console.error("variant-matrix error:", err);

    return NextResponse.json(
      { error: "Failed to fetch variants" },
      { status: 500 }
    );
  }
}