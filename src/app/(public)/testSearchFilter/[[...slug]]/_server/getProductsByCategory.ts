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

  // Chuẩn bị tham số cho LIKE pattern (tránh truyền undefined vào query)
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
      -- Lọc theo Search (Nếu searchPattern là null thì bỏ qua điều kiện này)
      AND (${searchPattern} IS NULL OR (p.name ILIKE ${searchPattern} OR p.description ILIKE ${searchPattern}))
      -- Lọc theo Category Path
      AND (${slugPattern} IS NULL OR c.category_path LIKE ${slugPattern})
    GROUP BY 
      p.id, p.name, p.slug, p.thumbnail_url
    HAVING 
      -- Lọc theo khoảng giá (Dùng COALESCE hoặc IS NULL để handle trường hợp không nhập giá)
      (${minPrice ?? null} IS NULL OR MIN(v.price) >= ${minPrice})
      AND 
      (${maxPrice ?? null} IS NULL OR MIN(v.price) <= ${maxPrice})
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}
