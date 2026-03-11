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
        p.id as product_id,
        p.name,
        p.slug,
        p.status,
        p.description,
        p.short_description,

        v.id as variant_id,
        v.sku,
        v.price,
        v.stock,

        a.id as attribute_id,
        a.name as attribute_name,

        av.id as attribute_value_id,
        av.value as attribute_value,

        pi.id as image_id,
        pi.image_url,
        pi.is_thumbnail

      from products p

      left join product_variants v
        on v.product_id = p.id
        and v.is_active = true

      left join variant_attribute_values vav
        on vav.variant_id = v.id

      left join attribute_values av
        on av.id = vav.attribute_value_id

      left join attributes a
        on a.id = av.attribute_id

      left join product_images pi
        on pi.product_id = p.id

      where p.id = ${id}

      order by
        v.created_at,
        a.name,
        av.value
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = {
      id: rows[0].product_id,
      name: rows[0].name,
      slug: rows[0].slug,
      status: rows[0].status,
      description: rows[0].description,
      short_description: rows[0].short_description,
    };

    const variantsMap = new Map();
    const attributesMap = new Map();
    const imagesMap = new Map();

    for (const row of rows) {
      if (row.variant_id) {
        if (!variantsMap.has(row.variant_id)) {
          variantsMap.set(row.variant_id, {
            id: row.variant_id,
            sku: row.sku,
            price: row.price,
            stock: row.stock,
            attributes: {},
          });
        }

        if (row.attribute_name) {
          variantsMap.get(row.variant_id).attributes[row.attribute_name] =
            row.attribute_value;
        }
      }

      if (row.attribute_id) {
        if (!attributesMap.has(row.attribute_id)) {
          attributesMap.set(row.attribute_id, {
            id: row.attribute_id,
            name: row.attribute_name,
            values: new Map(),
          });
        }

        if (row.attribute_value_id) {
          attributesMap
            .get(row.attribute_id)
            .values.set(row.attribute_value_id, {
              id: row.attribute_value_id,
              value: row.attribute_value,
            });
        }
      }

      if (row.image_id) {
        imagesMap.set(row.image_id, {
          id: row.image_id,
          url: row.image_url,
          is_thumbnail: row.is_thumbnail,
        });
      }
    }

    const attributes = Array.from(attributesMap.values()).map((attr) => ({
      id: attr.id,
      name: attr.name,
      values: Array.from(attr.values.values()),
    }));

    const variants = Array.from(variantsMap.values());

    const images = Array.from(imagesMap.values());

    return NextResponse.json({
      product,
      attributes,
      variants,
      images,
    });

  } catch (err) {
    console.error("product-full error:", err);

    return NextResponse.json(
      { error: "Failed to fetch product detail" },
      { status: 500 }
    );
  }
}