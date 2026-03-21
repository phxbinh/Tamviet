// src/lib/db/products.ts
import "server-only";
import { sql } from "@/lib/neon/sql";

export async function getProductsByCategory(options: {
  slug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  productTypeCode?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "oldest";
  page?: number;
  limit?: number;
}) {
  const { 
    slug, 
    search, 
    minPrice, 
    maxPrice, 
    productTypeCode,
    sort = "newest",
    page = 1, 
    limit = 8 
  } = options;
  
  const offset = (page - 1) * limit;

  const searchPattern = search ? `%${search}%` : null;
  const slugPattern = slug ? `${slug}%` : null;

  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.thumbnail_url,
      MIN(v.price) as price_min,
      SUM(v.stock) as total_stock,
      COUNT(*) OVER() AS total_count
    FROM products p
    LEFT JOIN product_types pt ON p.product_type_id = pt.id
    LEFT JOIN product_variants v 
      ON v.product_id = p.id AND v.is_active = true
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    LEFT JOIN categories c ON c.id = pc.category_id
    WHERE 
      p.status = 'active'
      AND (${searchPattern}::text IS NULL 
        OR (p.name ILIKE ${searchPattern} OR p.description ILIKE ${searchPattern}))
      AND (${slugPattern}::text IS NULL 
        OR c.category_path LIKE ${slugPattern})
      AND (${productTypeCode ?? null}::text IS NULL 
        OR pt.code = ${productTypeCode})
    GROUP BY 
      p.id
    HAVING 
      (${minPrice ?? null}::numeric IS NULL OR MIN(v.price) >= ${minPrice})
      AND (${maxPrice ?? null}::numeric IS NULL OR MIN(v.price) <= ${maxPrice})

    ORDER BY
      -- 🔥 sort theo giá
      CASE WHEN ${sort} = 'price_asc'  THEN MIN(v.price) END ASC,
      CASE WHEN ${sort} = 'price_desc' THEN MIN(v.price) END DESC,

      -- 🔥 sort theo thời gian
      CASE WHEN ${sort} = 'oldest' THEN p.created_at END ASC,
      CASE WHEN ${sort} = 'newest' THEN p.created_at END DESC,

      -- fallback (quan trọng)
      p.created_at DESC

    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}

export async function getProductTypes() {
  return await sql`SELECT code, name FROM product_types ORDER BY name ASC`;
}
