// db/queries/getProductsForEmbedding.ts

/*
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
*/


import { db } from "./index";
import { sql } from "drizzle-orm";

export async function getProductsForEmbedding() {
  const result = await db.execute(sql`
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.description,

      -- lấy categories (M:N)
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'slug', c.slug
            )
          )
          FROM product_categories pc
          JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id
        ),
        '[]'
      ) as categories,

      -- variants + attributes
      COALESCE(
        json_agg(
          json_build_object(
            'variant_id', v.id,
            'price', v.price,
            'stock', v.stock,
            'attributes', COALESCE(
              (
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
              ),
              '[]'
            )
          )
        ) FILTER (WHERE v.id IS NOT NULL),
        '[]'
      ) as variants

    FROM products p
    LEFT JOIN product_variants v 
      ON v.product_id = p.id
      AND v.is_active = true

    WHERE p.status = 'active'

    GROUP BY p.id;
  `);

  return result.rows;
}





