//src/app/api/admin/products/[id]/attributes/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  //const productId = params.id;
const { id } = await context.params

  if (!id) {
    return NextResponse.json(
      { error: "product id is required" },
      { status: 400 }
    );
  }

  try {
    const rows = await sql`
      select distinct
        a.id,
        a.name,
        a.sort_order
      from product_variants v
      join variant_attribute_values vav
        on vav.variant_id = v.id
      join attribute_values av
        on av.id = vav.attribute_value_id
      join attributes a
        on a.id = av.attribute_id
      where v.product_id = ${id}
      order by a.sort_order asc, a.name asc
    `;

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch product attributes" },
      { status: 500 }
    );
  }
}