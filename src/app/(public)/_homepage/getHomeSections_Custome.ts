// Lấy theo dữ liệu truyền vào và sắp xếp theo A->Z
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

export async function getHomeSections(
  typeCodes?: string[], // Tham số tùy chọn, ví dụ: ['ao-thun', 'quan-jean']
  limitPerType = 8
): Promise<HomeSection[]> {
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
                p.id, p.name, p.slug, p.thumbnail_url,
                (
                  SELECT MIN(pv.price) 
                  FROM product_variants pv 
                  WHERE pv.product_id = p.id AND pv.is_active = true
                ) as price_min
              FROM products p
              WHERE p.product_type = pt.code
                AND p.status = 'active'
              ORDER BY p.created_at DESC
              LIMIT ${limitPerType}
            ) p_sub
          ), 
          '[]'
        ) as products
      FROM product_types pt
      WHERE pt.code != 'default'
        -- 🔥 Điều kiện lọc theo danh sách truyền vào
        ${typeCodes && typeCodes.length > 0 
          ? sql`AND pt.code IN (${typeCodes})` 
          : sql``}
      ORDER BY pt.name ASC;
    `;

    return (rows as HomeSection[]).filter(
      (s) => s.products && s.products.length > 0
    );
  } catch (err) {
    console.error("getHomeSections error:", err);
    return [];
  }
}
/* Cách sử dụng

// Cách 1: Lấy TOÀN BỘ danh mục (Trừ default)
const allSections = await getHomeSections(); 

// Cách 2: Lấy TOÀN BỘ danh mục (Cũng tương tự cách 1)
const allSectionsExplicit = await getHomeSections([]); 

// Cách 3: Chỉ lấy danh mục cụ thể (Theo đúng ý bạn)
const specificSections = await getHomeSections(['ao-thun', 'quan-jean']);

*/


// Lấy data theo mãng truyền vào và theo đúng thứ tự mảng
export async function getHomeSections_(
  typeCodes: string[] = [], // Mặc định là mảng rỗng
  limitPerType = 8
): Promise<HomeSection[]> {
  try {
    // Nếu mảng rỗng, trả về mảng trống luôn để đỡ tốn query database
    if (!typeCodes || typeCodes.length === 0) return [];

    const rows = await sql`
      SELECT 
        pt.code as type_code,
        pt.name as type_name,
        COALESCE(
          (
            SELECT json_agg(p_sub)
            FROM (
              SELECT 
                p.id, p.name, p.slug, p.thumbnail_url,
                (
                  SELECT MIN(pv.price) 
                  FROM product_variants pv 
                  WHERE pv.product_id = p.id AND pv.is_active = true
                ) as price_min
              FROM products p
              WHERE p.product_type = pt.code
                AND p.status = 'active'
              ORDER BY p.created_at DESC
              LIMIT ${limitPerType}
            ) p_sub
          ), 
          '[]'
        ) as products
      FROM product_types pt
      WHERE pt.code IN (${typeCodes})  -- 🔥 Chỉ lấy các code trong danh sách
        AND pt.code != 'default'
      
      -- 🔥 Sắp xếp theo đúng thứ tự của mảng typeCodes truyền vào
      ORDER BY array_position(ARRAY[${typeCodes}]::text[], pt.code::text);
    `;

    return (rows as HomeSection[]).filter(
      (s) => s.products && s.products.length > 0
    );
  } catch (err) {
    console.error("getHomeSections error:", err);
    return [];
  }
}


/*
Nếu là mảng rỗng thì trả kết quả []
*/



