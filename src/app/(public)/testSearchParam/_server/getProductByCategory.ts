// src/app/(public)testSearchParams/_serber/getProductByCategory.ts
/*
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
*/



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
    limit = 8,
  } = options;

  const offset = (page - 1) * limit;

  const searchPattern = search ? `%${search}%` : null;
  const slugPattern = slug ? `${slug}%` : null;

  // =============================
  // 🔥 1. BASE FILTER (CHỈ LẤY ID)
  // =============================
  const baseFilter = sql`
    FROM products p
    LEFT JOIN product_types pt ON pt.id = p.product_type_id
    WHERE 
      p.status = 'active'

      AND (${productTypeCode ?? null}::text IS NULL 
        OR pt.code = ${productTypeCode}
      )

      AND (
        ${slugPattern}::text IS NULL OR EXISTS (
          SELECT 1
          FROM product_categories pc
          JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id
            AND c.category_path LIKE ${slugPattern}
        )
      )

      AND (
        ${searchPattern}::text IS NULL 
        OR p.name ILIKE ${searchPattern}
      )
  `;

  // =============================
  // 🔥 2. COUNT (NHẸ)
  // =============================
  const countPromise = sql`
    SELECT COUNT(*) as total
    ${baseFilter}
  `;

  // =============================
  // 🔥 3. SORT LOGIC
  // =============================
  let orderBase = sql`ORDER BY p.created_at DESC`;

  if (sort === "oldest") {
    orderBase = sql`ORDER BY p.created_at ASC`;
  }

  // ⚠️ price sort sẽ xử lý ở phase 2
  const isSortByPrice =
    sort === "price_asc" || sort === "price_desc";

  // =============================
  // 🔥 4. QUERY DATA (2 PHASE)
  // =============================
  const dataPromise = sql`
    WITH base_products AS (
      SELECT p.id, p.created_at
      ${baseFilter}
      ${!isSortByPrice ? orderBase : sql``}
      LIMIT ${limit} OFFSET ${offset}
    ),

    aggregated AS (
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url,
        p.created_at,
        MIN(v.price) AS price_min,
        COALESCE(SUM(v.stock), 0) AS total_stock
      FROM products p
      JOIN base_products bp ON bp.id = p.id
      LEFT JOIN product_variants v 
        ON v.product_id = p.id AND v.is_active = true
      GROUP BY p.id, p.name, p.slug, p.thumbnail_url, p.created_at
    )

    SELECT *
    FROM aggregated
    ${
      isSortByPrice
        ? sort === "price_asc"
          ? sql`ORDER BY price_min ASC, created_at DESC`
          : sql`ORDER BY price_min DESC, created_at DESC`
        : sql`ORDER BY created_at DESC`
    }
  `;

  // =============================
  // 🔥 5. EXECUTE SONG SONG
  // =============================
  const [countResult, rows] = await Promise.all([
    countPromise,
    dataPromise,
  ]);

  const total_count = Number(countResult[0]?.total || 0);

  return rows.map((row: any) => ({
    ...row,
    total_count,
  }));
}


export async function getProductTypes() {
  return await sql`SELECT code, name FROM product_types ORDER BY name ASC`;
}

