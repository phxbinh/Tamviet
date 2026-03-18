import "server-only";
import { sql } from "@/lib/neon/sql";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
  thumbnail: string | null;
  price_min: number | null;
  total_stock: number | null;
}

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit = 4
): Promise<RelatedProduct[]> {
  try {
    const rows = await sql`
      WITH variant_data AS (
        SELECT
          product_id,
          MIN(price) AS price_min,
          SUM(stock) AS total_stock
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
        vd.price_min,
        vd.total_stock,
        t.image_url AS thumbnail
      FROM products p

      INNER JOIN product_categories pc 
        ON pc.product_id = p.id

      LEFT JOIN variant_data vd 
        ON vd.product_id = p.id

      LEFT JOIN thumbnail t 
        ON t.product_id = p.id

      WHERE pc.category_id = ${categoryId}
        AND p.id != ${currentProductId}
        AND p.status = 'active'

      ORDER BY p.created_at DESC
      LIMIT ${limit};
    `;

    return rows;
  } catch (err) {
    console.error("getRelatedProducts error:", err);
    return [];
  }
}