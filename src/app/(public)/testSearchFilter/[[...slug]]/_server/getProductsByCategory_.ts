// src/lib/db/products.ts
import "server-only";
import { sql } from "@/lib/neon/sql";

export async function getProductsByCategory(options: {
  slug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  productTypeCode?: string;
  sort?: string; // <-- Thêm option Sort
  page?: number;
  limit?: number;
}) {
  const { 
    slug, 
    search, 
    minPrice, 
    maxPrice, 
    productTypeCode,
    sort = "latest", // Mặc định là mới nhất
    page = 1, 
    limit = 8 
  } = options;
  
  const offset = (page - 1) * limit;

  const searchPattern = search ? `%${search}%` : null;
  const slugPattern = slug ? `${slug}%` : null;

  // --- LOGIC XỬ LÝ SORT ĐỘNG ---
  // Chúng ta sử dụng sql fragment để tránh lỗi SQL Injection và đảm bảo performance
  let orderBy = sql`p.created_at DESC`; // Mặc định

  if (sort === "price_asc") {
    orderBy = sql`MIN(v.price) ASC`;
  } else if (sort === "price_desc") {
    orderBy = sql`MIN(v.price) DESC`;
  } else if (sort === "oldest") {
    orderBy = sql`p.created_at ASC`;
  } else if (sort === "name_asc") {
    orderBy = sql`p.name ASC`;
  }

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
    LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_active = true
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    LEFT JOIN categories c ON c.id = pc.category_id
    WHERE 
      p.status = 'active'
      AND (${searchPattern}::text IS NULL OR (p.name ILIKE ${searchPattern}::text OR p.description ILIKE ${searchPattern}::text))
      AND (${slugPattern}::text IS NULL OR c.category_path LIKE ${slugPattern}::text)
      AND (${productTypeCode ?? null}::text IS NULL OR pt.code = ${productTypeCode}::text)
    GROUP BY 
      p.id, p.name, p.slug, p.thumbnail_url, p.created_at -- Thêm p.created_at vào group by nếu cần sort theo nó
    HAVING 
      (${minPrice ?? null}::numeric IS NULL OR MIN(v.price) >= ${minPrice}::numeric)
      AND 
      (${maxPrice ?? null}::numeric IS NULL OR MIN(v.price) <= ${maxPrice}::numeric)
    ORDER BY ${orderBy} -- <-- Sử dụng biến orderBy động tại đây
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}

export async function getProductTypes() {
  return await sql`SELECT code, name FROM product_types ORDER BY name ASC`;
}
