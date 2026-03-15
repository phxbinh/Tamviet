import "server-only"
import { sql } from "@/lib/neon/sql";

// --- INTERFACES (Định nghĩa trực tiếp để đảm bảo tính độc lập) ---
interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface Variant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
}

interface ProductFull {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: ProductImage[];
}

export async function getProductFull(id: string): Promise<ProductFull | null> {
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
      return null; // Hoặc ném lỗi tùy bạn
    }

    const product = productRows[0] as Product;

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
      left join variant_attribute_values vav on vav.variant_id = v.id
      left join attribute_values av on av.id = vav.attribute_value_id
      left join attributes a on a.id = av.attribute_id
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
      join attribute_values av on av.attribute_id = a.id
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

    /* ---------------- RETURN DATA ---------------- */
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
