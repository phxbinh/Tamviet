//src/app/api/admin/products/[id]/details/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Product id is required" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ Product + summary aggregate
    const productRows = await sql`
      select
        p.*,
        coalesce(sum(v.stock), 0) as total_stock,
        min(v.price) as min_price,
        max(v.price) as max_price,
        count(v.id) as variant_count
      from products p
      left join product_variants v
        on v.product_id = p.id
      where p.id = ${id}
      group by p.id
    `;

    if (productRows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = productRows[0];

    // 2️⃣ Variants (flatten attribute values)
    const variants = await sql`
      select
        v.*,
        json_agg(
          json_build_object(
            'attribute_name', a.name,
            'attribute_value', av.value
          )
        ) as attributes
      from product_variants v
      left join variant_attribute_values vav
        on vav.variant_id = v.id
      left join attribute_values av
        on av.id = vav.attribute_value_id
      left join attributes a
        on a.id = av.attribute_id
      where v.product_id = ${id}
      group by v.id
      order by v.created_at asc
    `;


    // 3️⃣ Attribute headers (cho table UI)
    const attributes = await sql`
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

    // 4️⃣ Product images (nếu có table)
/*
    const images = await sql`
      select *
      from product_images
      where product_id = ${id}
      order by sort_order asc, created_at asc
    `;
*/

const images = await sql`
    select
      id,
      image_url,
      alt_text,
      display_order,
      is_thumbnail
    from product_images
    where product_id = ${id}
      and is_active = true
    order by display_order
  `







    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        category_id: product.category_id,
        status: product.status,
        created_at: product.created_at,
        updated_at: product.updated_at,
      },
      summary: {
        total_stock: Number(product.total_stock),
        min_price: product.min_price,
        max_price: product.max_price,
        variant_count: Number(product.variant_count),
      },
      variants,
      attributes,
      images,
    });

  } catch (err) {
    console.error("Admin product full error:", err);

    return NextResponse.json(
      { error: "Failed to fetch product detail" },
      { status: 500 }
    );
  }
}


