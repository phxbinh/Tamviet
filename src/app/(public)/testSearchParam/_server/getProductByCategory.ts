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

  // Chuẩn hóa chuỗi tìm kiếm để dùng với ILIKE
  // Dùng trim() để loại bỏ khoảng trắng thừa
  const cleanSearch = search?.trim() ? `%${search.trim()}%` : null;
  const slugPattern = slug ? `${slug}%` : null;

  try {
    const rows = await sql`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url,
        p.created_at,
        -- Ép kiểu numeric sang float để JS nhận diện là số
        MIN(v.price)::float as price_min,
        SUM(v.stock)::integer as total_stock,
        COUNT(*) OVER() AS total_count
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_variants v 
        ON v.product_id = p.id AND v.is_active = true
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      WHERE 
        p.status = 'active'
        
        -- logic TÌM KIẾM THÔNG MINH
        AND (
          ${cleanSearch}::text IS NULL 
          OR (
            -- Tìm kiếm không dấu (unaccent) và không phân biệt hoa thường (ILIKE)
            unaccent(p.name) ILIKE unaccent(${cleanSearch})
            OR unaccent(COALESCE(p.description, '')) ILIKE unaccent(${cleanSearch})
            OR p.slug ILIKE ${cleanSearch}
          )
        )

        -- Lọc theo danh mục (Category Path)
        AND (
          ${slugPattern}::text IS NULL 
          OR c.category_path LIKE ${slugPattern}
        )

        -- Lọc theo loại sản phẩm (Product Type)
        AND (
          ${productTypeCode ?? null}::text IS NULL 
          OR pt.code = ${productTypeCode}
        )

      GROUP BY 
        p.id, p.name, p.slug, p.thumbnail_url, p.created_at

      -- Lọc theo khoảng giá (sau khi đã GROUP BY để lấy MIN price)
      HAVING 
        (${minPrice ?? null}::numeric IS NULL OR MIN(v.price) >= ${minPrice})
        AND (${maxPrice ?? null}::numeric IS NULL OR MIN(v.price) <= ${maxPrice})

      ORDER BY
        -- Sắp xếp theo giá
        CASE WHEN ${sort} = 'price_asc'  THEN MIN(v.price) END ASC,
        CASE WHEN ${sort} = 'price_desc' THEN MIN(v.price) END DESC,

        -- Sắp xếp theo thời gian
        CASE WHEN ${sort} = 'oldest' THEN p.created_at END ASC,
        CASE WHEN ${sort} = 'newest' THEN p.created_at END DESC,

        -- Fallback sắp xếp
        p.created_at DESC

      LIMIT ${limit} OFFSET ${offset}
    `;

    return rows;
  } catch (error) {
    console.error("Database Error in getProductsByCategory:", error);
    throw new Error("Failed to fetch products.");
  }
}


 // Lấy danh sách Product Types để hiển thị trong bộ lọc
export async function getProductTypes() {
  try {
    return await sql`
      SELECT code, name 
      FROM product_types 
      ORDER BY name ASC
    `;
  } catch (error) {
    console.error("Error fetching product types:", error);
    return [];
  }
}
*/


import "server-only";
import { sql } from "@/lib/neon/sql";

type SortType = "price_asc" | "price_desc" | "newest" | "oldest";

export async function getProductsByCategory(options: {
  slug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  productTypeCode?: string;
  sort?: SortType;
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

  // =========================
  // 🔍 SEARCH
  // =========================
  const rawSearch = search?.trim();
  const flexibleSearch = rawSearch
    ? `%${rawSearch.replace(/\s+/g, "%")}%`
    : null;

  const slugPattern = slug ? `${slug}%` : null;

  // =========================
  // 🧠 BUILD WHERE
  // =========================
  const whereClauses: string[] = ["p.status = 'active'"];
  const params: any[] = [];
  let i = 1;

  if (productTypeCode) {
    whereClauses.push(`pt.code = $${i++}`);
    params.push(productTypeCode);
  }

  if (slugPattern) {
    whereClauses.push(`c.category_path LIKE $${i++}`);
    params.push(slugPattern);
  }

  if (flexibleSearch) {
    whereClauses.push(`
      (
        immutable_unaccent(p.name) ILIKE immutable_unaccent($${i})
        OR immutable_unaccent(COALESCE(p.description, '')) ILIKE immutable_unaccent($${i})
        OR p.slug ILIKE $${i}
      )
    `);
    params.push(flexibleSearch);
    i++;
  }

  // =========================
  // 💰 PRICE FILTER
  // =========================
  const priceClauses: string[] = [];

  if (minPrice !== undefined) {
    priceClauses.push(`vs.price_min >= $${i++}`);
    params.push(minPrice);
  }

  if (maxPrice !== undefined) {
    priceClauses.push(`vs.price_min <= $${i++}`);
    params.push(maxPrice);
  }

  const priceWhere =
    priceClauses.length > 0 ? priceClauses.join(" AND ") : "true";

  // =========================
  // 🔀 ORDER BY
  // =========================
  let orderBy = "fp.created_at DESC";

  if (sort === "price_asc") orderBy = "vs.price_min ASC";
  if (sort === "price_desc") orderBy = "vs.price_min DESC";
  if (sort === "oldest") orderBy = "fp.created_at ASC";

  // =========================
  // 📦 MAIN QUERY
  // =========================
  const query = `
    WITH filtered_products AS (
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url,
        p.created_at
      FROM products p
      LEFT JOIN product_types pt ON pt.id = p.product_type_id
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      WHERE ${whereClauses.join(" AND ")}
    ),

    variant_stats AS (
      SELECT 
        v.product_id,
        MIN(v.price)::float as price_min,
        SUM(v.stock)::int as total_stock
      FROM product_variants v
      WHERE v.is_active = true
      GROUP BY v.product_id
    )

    SELECT 
      fp.id,
      fp.name,
      fp.slug,
      fp.thumbnail_url,
      fp.created_at,
      vs.price_min,
      vs.total_stock
    FROM filtered_products fp
    JOIN variant_stats vs ON vs.product_id = fp.id
    WHERE ${priceWhere}
    ORDER BY ${orderBy}
    LIMIT $${i++} OFFSET $${i++}
  `;

  params.push(limit, offset);

  // =========================
  // 📊 COUNT QUERY
  // =========================
  const countQuery = `
    WITH filtered_products AS (
      SELECT p.id
      FROM products p
      LEFT JOIN product_types pt ON pt.id = p.product_type_id
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      WHERE ${whereClauses.join(" AND ")}
    )
    SELECT COUNT(*)::int as total
    FROM filtered_products
  `;

  try {
    const dataRows = await sql(query, params);
    const countRows = await sql(countQuery, params.slice(0, i - 3));

    const total = countRows[0]?.total ?? 0;

    return {
      data: dataRows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("🔥 DB ERROR:", error);
    throw error;
  }
}


export async function getProductTypes() {
  return await sql`SELECT code, name FROM product_types ORDER BY name ASC`;
}


