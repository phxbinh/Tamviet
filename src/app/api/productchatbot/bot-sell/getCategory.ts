
//sử dụng cho tìm kiếm sản phẩm tử chatbot
// ví dụ:
// Tìm cho tôi các sản phẩm trái cây có giá
// từ 100k đến 1000k

import { sqlApp as sql } from '@/lib/neon/sql';

export async function getCategory(category: string) {
  if (!category) {
    return null;
  }

  try {
    const rows = await sql`
      SELECT
        c.id,
        c.name,
        c.slug,
        pt.code
      FROM categories c

      LEFT JOIN product_types pt
        ON LOWER(pt.name) = LOWER(c.name)

      WHERE c.is_active = true
      AND (
        LOWER(c.name) LIKE LOWER(${`%${category}%`})
        OR LOWER(c.slug) LIKE LOWER(${`%${category}%`})
        OR LOWER(pt.code) LIKE LOWER(${`%${category}%`})
      )

      ORDER BY c.display_order ASC

      LIMIT 1
    `;

    return rows[0] || null;

  } catch (error) {
    console.error('getCategory error:', error);
    return null;
  }
}