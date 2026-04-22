// db/queries/getProductsForEmbedding.ts

import { db } from "./index";
import { sql } from "drizzle-orm";

export async function getProductsForEmbedding() {
  const result = await db.execute(sql`
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.description,
      p.category_id,

      json_agg(
        json_build_object(
          'variant_id', v.id,
          'price', v.price,
          'stock', v.stock,
          'attributes', (
            SELECT json_agg(
              json_build_object(
                'name', a.name,
                'value', av.value
              )
            )
            FROM variant_attribute_values vav
            JOIN attribute_values av ON av.id = vav.attribute_value_id
            JOIN attributes a ON a.id = av.attribute_id
            WHERE vav.variant_id = v.id
          )
        )
      ) as variants

    FROM products p
    JOIN product_variants v ON v.product_id = p.id
    GROUP BY p.id;
  `);

  return result.rows;
}