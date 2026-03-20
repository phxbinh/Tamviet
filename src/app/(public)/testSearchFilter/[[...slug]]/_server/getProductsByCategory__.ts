// src/lib/db/products.ts
import "server-only";
import { sql } from "@/lib/neon/sql";

async function getProductsByCategory_(options: {
  slug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  productTypeCode?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const { 
    slug, 
    search, 
    minPrice, 
    maxPrice, 
    productTypeCode,
    sort = "latest", 
    page = 1, 
    limit = 8 
  } = options;
  
  const offset = (page - 1) * limit;

  const searchPattern = search ? `%${search}%` : null;
  const slugPattern = slug ? `${slug}%` : null;

  // --- FIX LOGIC SORT ĐỘNG ---
  // Sử dụng sql fragment để bọc logic sắp xếp
  let orderBy = sql`p.created_at DESC`; // Mặc định: Sản phẩm mới nhất lên đầu

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
      p.created_at, -- Lấy thêm để phục vụ GROUP BY và SORT
      MIN(v.price) as price_min,
      SUM(v.stock) as total_stock,
      COUNT(*) OVER() AS total_count
    FROM products p
    -- Join với Variant để lấy giá và kho
    LEFT JOIN product_variants v 
      ON v.product_id = p.id 
      AND v.is_active = true
    -- Join với Product Types để lọc theo loại (clothes, pump...)
    LEFT JOIN product_types pt 
      ON p.product_type_id = pt.id
    -- Join với Categories để lọc theo Slug đường dẫn
    LEFT JOIN product_categories pc 
      ON pc.product_id = p.id
    LEFT JOIN categories c 
      ON c.id = pc.category_id
    WHERE 
      p.status = 'active'
      -- Tìm kiếm theo tên hoặc mô tả
      AND (${searchPattern}::text IS NULL OR (p.name ILIKE ${searchPattern}::text OR p.description ILIKE ${searchPattern}::text))
      -- Lọc theo danh mục (hỗ trợ tìm cả danh mục con qua category_path)
      AND (${slugPattern}::text IS NULL OR c.category_path LIKE ${slugPattern}::text)
      -- Lọc theo mã loại sản phẩm
      AND (${productTypeCode ?? null}::text IS NULL OR pt.code = ${productTypeCode}::text)
    GROUP BY 
      p.id, p.name, p.slug, p.thumbnail_url, p.created_at
    HAVING 
      -- Lọc khoảng giá dựa trên giá thấp nhất của variant
      (${minPrice ?? null}::numeric IS NULL OR MIN(v.price) >= ${minPrice}::numeric)
      AND 
      (${maxPrice ?? null}::numeric IS NULL OR MIN(v.price) <= ${maxPrice}::numeric)
    ORDER BY ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}

// src/lib/db/products.ts

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

  // 1. Xác định logic ORDER BY bằng SQL Fragment
  let orderBy = sql`p.created_at DESC`; 
  if (sort === "price_asc") orderBy = sql`price_min ASC`;
  else if (sort === "price_desc") orderBy = sql`price_min DESC`;
  else if (sort === "oldest") orderBy = sql`p.created_at ASC`;
  else if (sort === "name_asc") orderBy = sql`p.name ASC`;

  // 2. Sử dụng Sub-query để tính price_min từ bảng variants trước khi sort
  const rows = await sql`
    SELECT * FROM (
      SELECT
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url,
        p.created_at,
        -- Tính giá thấp nhất từ bảng product_variants
        (
          SELECT MIN(price) 
          FROM product_variants 
          WHERE product_id = p.id AND is_active = true
        ) as price_min,
        -- Tính tổng kho
        (
          SELECT SUM(stock) 
          FROM product_variants 
          WHERE product_id = p.id AND is_active = true
        ) as total_stock,
        COUNT(*) OVER() AS total_count
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      WHERE 
        p.status = 'active'
        AND (${searchPattern}::text IS NULL OR (p.name ILIKE ${searchPattern}::text OR p.description ILIKE ${searchPattern}::text))
        AND (${slugPattern}::text IS NULL OR c.category_path LIKE ${slugPattern}::text)
        AND (${productTypeCode ?? null}::text IS NULL OR pt.code = ${productTypeCode}::text)
      GROUP BY p.id, p.name, p.slug, p.thumbnail_url, p.created_at
    ) as filtered_products
    WHERE 
      -- Lọc khoảng giá trên kết quả đã tính toán
      (${minPrice ?? null}::numeric IS NULL OR price_min >= ${minPrice}::numeric)
      AND 
      (${maxPrice ?? null}::numeric IS NULL OR price_min <= ${maxPrice}::numeric)
    ORDER BY ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}



export async function getProductTypes() {
  return await sql`SELECT code, name FROM product_types ORDER BY name ASC`;
}
