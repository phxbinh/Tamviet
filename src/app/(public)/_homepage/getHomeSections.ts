// _homepage/getHomeSections.ts
import "server-only";
import { sql } from "@/lib/neon/sql";

export interface HomeSection {
  type_code: string;
  type_name: string;
  products: {
    id: string;
    slug: string;
    name: string;
    thumbnail_url: string;
    price_min: number;
  }[];
}
/*
export async function getHomeSections(limitPerType = 8): Promise<HomeSection[]> {
  try {
    // Truy vấn lấy danh mục và top N sản phẩm của mỗi danh mục bằng LATERAL JOIN
    const rows = await sql`
      SELECT 
        pt.code as type_code,
        pt.name as type_name,
        COALESCE(
          json_agg(p_data.*) FILTER (WHERE p_data.id IS NOT NULL), 
          '[]'
        ) as products
      FROM product_types pt
      LEFT JOIN LATERAL (
        SELECT 
          p.id, 
          p.name, 
          p.slug, 
          p.thumbnail_url,
          MIN(pv.price) as price_min
        FROM products p
        LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = true
        WHERE p.product_type = pt.code 
          AND p.status = 'active'
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ${limitPerType}
      ) p_data ON true
      WHERE pt.is_active = true
      GROUP BY pt.code, pt.name, pt.sort_order
      ORDER BY pt.sort_order ASC NULLS LAST, pt.name ASC;
    `;

    return rows as HomeSection[];
  } catch (err) {
    console.error("getHomeSections error:", err);
    return [];
  }
}
*/

/* gemini
export async function getHomeSections(limitPerType = 8): Promise<HomeSection[]> {
  try {
    const rows = await sql`
      SELECT 
        pt.code as type_code,
        pt.name as type_name,
        COALESCE(
          (
            SELECT json_agg(p_sub)
            FROM (
              SELECT 
                p.id, 
                p.name, 
                p.slug, 
                p.thumbnail_url,
                (SELECT MIN(price) FROM product_variants WHERE product_id = p.id) as price_min
              FROM products p
              WHERE p.product_type = pt.code
              -- Tạm thời comment dòng dưới nếu muốn check data tổng quát
              AND p.status = 'active' 
              ORDER BY p.created_at DESC
              LIMIT ${limitPerType}
            ) p_sub
          ), 
          '[]'
        ) as products
      FROM product_types
    `;

console.log("Dữ liệu thô từ SQL:", JSON.stringify(rows, null, 2));

    return rows as HomeSection[];
  } catch (err) {
    console.error("getHomeSections error:", err);
    return [];
  }
}
*/






export async function getHomeSections(limitPerType = 8): Promise<HomeSection[]> {
  try {
    const rows = await sql`
      SELECT 
        pt.code as type_code,
        pt.name as type_name,
        COALESCE(
          (
            SELECT json_agg(p_sub)
            FROM (
              SELECT 
                p.id, 
                p.name, 
                p.slug, 
                p.thumbnail_url,
                (
                  SELECT MIN(pv.price) 
                  FROM product_variants pv 
                  WHERE pv.product_id = p.id 
                    AND pv.is_active = true
                ) as price_min
              FROM products p
              WHERE p.product_type = pt.code      -- Khớp mã loại
                AND p.product_type != 'default'  -- Loại bỏ sản phẩm thuộc loại default
                AND p.status = 'active'          -- Chỉ lấy sản phẩm đang bán
              ORDER BY p.created_at DESC
              LIMIT ${limitPerType}
            ) p_sub
          ), 
          '[]'
        ) as products
      FROM product_types pt
      WHERE pt.code != 'default'                 -- Loại bỏ danh mục có mã là default
      ORDER BY pt.name ASC;
    `;

    // Lọc bỏ những Section nào không có sản phẩm để giao diện không bị trống
    const sections = (rows as HomeSection[]).filter(
      (section) => section.products && section.products.length > 0
    );

    return sections;
  } catch (err) {
    console.error("getHomeSections error:", err);
    return [];
  }
}







