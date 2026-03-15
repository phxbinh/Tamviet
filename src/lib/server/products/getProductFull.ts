import "server-only";
import { sql } from "@/lib/neon/sql";
import type { ProductFull, Product } from "@/types/productDetail";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  description: string | null;
  short_description: string | null;
};

type VariantRow = {
  variant_id: string;
  sku: string;
  price: number;
  stock: number;
  attribute_name: string | null;
  attribute_value: string | null;
};

type AttributeRow = {
  attribute_id: string;
  attribute_name: string;
  value_id: string;
  value: string;
};

type ImageRow = {
  id: string;
  image_url: string;
  is_thumbnail: boolean;
};

export async function getProductFull(
  id: string
): Promise<ProductFull | null> {

  try {

    /* ---------------- PRODUCT ---------------- */

    const productRows = await sql`
      select
        id,
        name,
        slug,
        status,
        description,
        short_description
      from products
      where id = ${id}
      and status = 'active'
      limit 1
    `;

    if (productRows.length === 0) {
      return null;
    }

    const product = productRows[0];


    /* ---------------- VARIANTS + ATTRIBUTES ---------------- */

    const variantRows = await sql`
      select
        v.id as variant_id,
        v.sku,
        v.price,
        v.stock,

        a.name as attribute_name,
        av.value as attribute_value

      from product_variants v

      left join variant_attribute_values vav
        on vav.variant_id = v.id

      left join attribute_values av
        on av.id = vav.attribute_value_id

      left join attributes a
        on a.id = av.attribute_id

      where v.product_id = ${id}
      and v.is_active = true

      order by v.created_at
    `;

    const variantsMap = new Map();

    for (const row of variantRows) {

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

    const variants = Array.from(variantsMap.values());


    /* ---------------- ATTRIBUTES (for UI selector) ---------------- */

    const attributeRows = await sql`
      select
        a.id as attribute_id,
        a.name as attribute_name,
        av.id as value_id,
        av.value

      from attributes a

      join attribute_values av
        on av.attribute_id = a.id

      where av.id in (

        select attribute_value_id
        from variant_attribute_values
        where variant_id in (
          select id
          from product_variants
          where product_id = ${id}
        )

      )

      order by a.name
    `;

    const attributesMap = new Map();

    for (const row of attributeRows) {

      if (!attributesMap.has(row.attribute_id)) {
        attributesMap.set(row.attribute_id, {
          id: row.attribute_id,
          name: row.attribute_name,
          values: [],
        });
      }

      attributesMap.get(row.attribute_id).values.push({
        id: row.value_id,
        value: row.value,
      });
    }

    const attributes = Array.from(attributesMap.values());


    /* ---------------- IMAGES ---------------- */

    const imageRows = await sql`
      select
        id,
        image_url,
        is_thumbnail
      from product_images
      where product_id = ${id}
      order by is_thumbnail desc, id
    `;

    const images = imageRows.map((img) => ({
      id: img.id,
      url: img.image_url,
      is_thumbnail: img.is_thumbnail,
    }));


    /* ---------------- RESPONSE ---------------- */

    return {
      product,
      attributes,
      variants,
      images,
    };

  } catch (err) {

    console.error("product-full error:", err);

    throw new Error("Failed to fetch product detail");
  }
}