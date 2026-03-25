import "server-only";
import { sql } from "@/lib/neon/sql";
import { ProductFull } from "./types";

export async function getProductDetail_slug(slug: string): Promise<ProductFull | null> {
  try {
    const rows = await sql`
      WITH target_product AS (
        SELECT 
          p.id,
          p.name,
          p.slug,
          p.description,
          p.short_description,
          p.thumbnail_url,
          pc.category_id
        FROM products p
        LEFT JOIN product_categories pc ON pc.product_id = p.id
        WHERE p.slug = ${slug}
          AND p.status = 'active'
        LIMIT 1
      ),

      variants_data AS (
        SELECT 
          v.id,
          v.sku,
          v.price::float,
          v.stock,
          img.image_url as variant_image,
          jsonb_object_agg(a.name, av.value) FILTER (WHERE a.id IS NOT NULL) as attributes
        FROM target_product tp
        JOIN product_variants v 
          ON v.product_id = tp.id AND v.is_active = true

        LEFT JOIN LATERAL (
          SELECT image_url
          FROM product_images pi
          WHERE pi.variant_id = v.id AND pi.is_active = true
          ORDER BY pi.display_order ASC
          LIMIT 1
        ) img ON true

        LEFT JOIN variant_attribute_values vav ON vav.variant_id = v.id
        LEFT JOIN attribute_values av ON av.id = vav.attribute_value_id
        LEFT JOIN attributes a ON a.id = av.attribute_id

        GROUP BY v.id, v.sku, v.price, v.stock, img.image_url
      ),

      unique_attributes AS (
        SELECT 
          a.id,
          a.name,
          jsonb_agg(
            jsonb_build_object('id', av.id, 'value', av.value)
          ) as values
        FROM target_product tp
        JOIN product_variants v 
          ON v.product_id = tp.id AND v.is_active = true
        JOIN variant_attribute_values vav ON vav.variant_id = v.id
        JOIN attribute_values av ON av.id = vav.attribute_value_id
        JOIN attributes a ON a.id = av.attribute_id

        GROUP BY a.id, a.name
      ),

      images_data AS (
        SELECT jsonb_agg(img ORDER BY is_thumbnail DESC, display_order ASC) as images
        FROM (
          -- product images
          SELECT 
            pi.id,
            pi.image_url as url,
            pi.is_thumbnail,
            pi.variant_id,
            pi.display_order
          FROM target_product tp
          JOIN product_images pi 
            ON pi.product_id = tp.id
          WHERE pi.is_active = true

          UNION ALL

          -- variant images
          SELECT 
            pi.id,
            pi.image_url as url,
            pi.is_thumbnail,
            pi.variant_id,
            pi.display_order
          FROM target_product tp
          JOIN product_variants v 
            ON v.product_id = tp.id
          JOIN product_images pi 
            ON pi.variant_id = v.id
          WHERE pi.is_active = true
        ) img
      ),

      price_data AS (
        SELECT MIN(v.price)::float as price_min
        FROM target_product tp
        JOIN product_variants v 
          ON v.product_id = tp.id AND v.is_active = true
      )

      SELECT jsonb_build_object(
        'product', jsonb_build_object(
          'id', tp.id,
          'name', tp.name,
          'slug', tp.slug,
          'description', tp.description,
          'short_description', tp.short_description,
          'thumbnail_url', tp.thumbnail_url,
          'category_id', tp.category_id,
          'price_min', pd.price_min
        ),
        'variants', COALESCE((SELECT jsonb_agg(v) FROM variants_data v), '[]'::jsonb),
        'attributes', COALESCE((SELECT jsonb_agg(ua) FROM unique_attributes ua), '[]'::jsonb),
        'images', COALESCE((SELECT images FROM images_data), '[]'::jsonb)
      ) as data
      FROM target_product tp
      LEFT JOIN price_data pd ON true;
    `;

    if (!rows || rows.length === 0) return null;
    return rows[0].data as ProductFull;

  } catch (err) {
    console.error("SQL Error in getProductDetail_slug:", err);
    throw new Error("Database fetch failed");
  }
}