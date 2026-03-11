import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "product id is required" },
      { status: 400 }
    );
  }

  try {
    const rows = await sql`
      select
        a.id as attribute_id,
        a.name as attribute_name,
        av.id as value_id,
        av.value
      from product_variants v
      join variant_attribute_values vav
        on vav.variant_id = v.id
      join attribute_values av
        on av.id = vav.attribute_value_id
      join attributes a
        on a.id = av.attribute_id
      where v.product_id = ${id}
      order by a.sort_order asc, av.value asc
    `;

    const map = new Map();

    for (const row of rows) {
      if (!map.has(row.attribute_id)) {
        map.set(row.attribute_id, {
          attribute_id: row.attribute_id,
          attribute_name: row.attribute_name,
          values: [],
        });
      }

      map.get(row.attribute_id).values.push({
        id: row.value_id,
        value: row.value,
      });
    }

    const result = Array.from(map.values());

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch attribute values" },
      { status: 500 }
    );
  }
}