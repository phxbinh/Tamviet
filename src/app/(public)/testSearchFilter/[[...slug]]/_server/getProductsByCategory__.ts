// src/app/(public)/testSearchFilter/[[...slug]]/_server/getProductsByCategory.ts
// search filter sort
export async function getProductsByCategory(options: {
  slug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  productTypeCode?: string;
  sort?: string; // <-- Thêm tham số sort
  page?: number;
  limit?: number;
}) {
  const { slug, search, minPrice, maxPrice, productTypeCode, sort, page = 1, limit = 8 } = options;
  const offset = (page - 1) * limit;

  const searchPattern = search ? `%${search}%` : null;
  const slugPattern = slug ? `${slug}%` : null;

  // Xử lý logic sắp xếp
  let orderBy = sql`p.created_at DESC`; // Mặc định: Mới nhất
  if (sort === 'price_asc') orderBy = sql`MIN(v.price) ASC`;
  if (sort === 'price_desc') orderBy = sql`MIN(v.price) DESC`;
  if (sort === 'oldest') orderBy = sql`p.created_at ASC`;

  const rows = await sql`
    SELECT
      p.id, p.name, p.slug, p.thumbnail_url,
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
    GROUP BY p.id, p.name, p.slug, p.thumbnail_url
    HAVING 
      (${minPrice ?? null}::numeric IS NULL OR MIN(v.price) >= ${minPrice}::numeric)
      AND (${maxPrice ?? null}::numeric IS NULL OR MIN(v.price) <= ${maxPrice}::numeric)
    ORDER BY ${orderBy} -- <-- Sử dụng biến sắp xếp động
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}
