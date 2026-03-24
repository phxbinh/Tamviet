// _homepage/getProductsByType.ts
import "server-only";
import { sql } from "@/lib/neon/sql";


interface Product {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  price_min: number;
}

export async function getProductsByType(
  productTypeCode: string,
  limit = 8
): Promise<Product[]> {
  const rows = await sql`
    WITH variant_data AS (
      SELECT
        product_id,
        MIN(price) AS price_min
      FROM product_variants
      WHERE is_active = true
      GROUP BY product_id
    ),
    thumbnail AS (
      SELECT DISTINCT ON (product_id)
        product_id,
        image_url
      FROM product_images
      WHERE is_thumbnail = true
      ORDER BY product_id
    )
    SELECT
      p.id,
      p.name,
      p.slug,
      p.thumbnail_url,
      vd.price_min
    FROM products p

    LEFT JOIN variant_data vd ON vd.product_id = p.id
    LEFT JOIN thumbnail t ON t.product_id = p.id

    WHERE p.product_type_code = ${productTypeCode}
      AND p.status = 'active'

    ORDER BY p.created_at DESC
    LIMIT ${limit};
  `;

  return rows as Product[];
}