import "server-only";
import { sql } from "@/lib/neon/sql";

export interface ProductType {
  code: string;
  name: string;
}

export async function getProductTypes(): Promise<ProductType[]> {
  try {
    const rows = await sql`
      SELECT
        code,
        name
      FROM product_types
      WHERE is_active = true
      ORDER BY sort_order ASC NULLS LAST, name ASC;
    `;

    return rows as ProductType[];
  } catch (err) {
    console.error("getProductTypes error:", err);
    return [];
  }
}