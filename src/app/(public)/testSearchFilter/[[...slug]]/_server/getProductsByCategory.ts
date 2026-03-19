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
  const { slug, search, minPrice, maxPrice, page = 1, limit = 8 } = options;
  const offset = (page - 1) * limit;

  // Xây dựng điều kiện WHERE động
  let whereConditions = [sql`p.status = 'active'`];
  
  // 1. Lọc theo Search
  if (search) {
    whereConditions.push(sql`(p.name ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'})`);
  }

  // 2. Lọc theo Category (Slug)
  if (slug) {
    whereConditions.push(sql`c.category_path LIKE ${slug + '%'}`);
  }

  // Gom các điều kiện lại
  const whereClause = sql.join(whereConditions, ' AND ');

  const rows = await sql`
    SELECT
      p.id, p.name, p.slug, p.thumbnail_url,
      MIN(v.price) as price_min,
      SUM(v.stock) as total_stock,
      COUNT(*) OVER() AS total_count -- Lấy tổng số dòng để phân trang
    FROM products p
    LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_active = true
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    LEFT JOIN categories c ON c.id = pc.category_id
    WHERE ${whereClause}
    GROUP BY p.id, p.name, p.slug, p.thumbnail_url
    HAVING 
      (${minPrice ? sql`MIN(v.price) >= ${minPrice}` : sql`true`}) AND
      (${maxPrice ? sql`MIN(v.price) <= ${maxPrice}` : sql`true`})
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}
