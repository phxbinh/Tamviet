// src/lib/db/products.ts
// src/lib/db/products.ts
import "server-only";
import { sql } from "@/lib/neon/sql";

export async function getProductsByCategory(options: {
  slug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}) {
  const { 
    slug, 
    search, 
    minPrice, 
    maxPrice, 
    page = 1, 
    limit = 8 
  } = options;
  
  const offset = (page - 1) * limit;

  // Đảm bảo không truyền undefined vào SQL
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
    LEFT JOIN product_variants v 
      ON v.product_id = p.id 
      AND v.is_active = true
    LEFT JOIN product_categories pc 
      ON pc.product_id = p.id
    LEFT JOIN categories c 
      ON c.id = pc.category_id
    WHERE 
      p.status = 'active'
      -- ÉP KIỂU ::text ĐỂ POSTGRES BIẾT ĐÂY LÀ CHUỖI KỂ CẢ KHI NULL
      AND (${searchPattern}::text IS NULL OR (p.name ILIKE ${searchPattern}::text OR p.description ILIKE ${searchPattern}::text))
      AND (${slugPattern}::text IS NULL OR c.category_path LIKE ${slugPattern}::text)
    GROUP BY 
      p.id, p.name, p.slug, p.thumbnail_url
    HAVING 
      -- ÉP KIỂU ::numeric CHO GIÁ
      (${minPrice ?? null}::numeric IS NULL OR MIN(v.price) >= ${minPrice}::numeric)
      AND 
      (${maxPrice ?? null}::numeric IS NULL OR MIN(v.price) <= ${maxPrice}::numeric)
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}
