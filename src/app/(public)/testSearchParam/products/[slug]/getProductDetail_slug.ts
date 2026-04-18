import "server-only";
import { sqlApp as sql } from "@/lib/neon/sql";
import { ProductFull } from "./types";

export async function getProductDetail_slug(slug: string): Promise<ProductFull | null> {
  try {
    const rows = await sql`
      WITH target_product AS (
        -- 1. Lấy sản phẩm gốc + Category ID (Đã fix lỗi alias p.id)
        SELECT 
          p.id, 
          p.name, 
          p.slug, 
          p.description, 
          p.short_description, 
          p.thumbnail_url,
          pc.category_id
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        WHERE p.slug = ${slug} AND p.status = 'active'
        ORDER BY p.created_at DESC -- Đảm bảo tính nhất quán nếu có trùng slug
        LIMIT 1
      ),

      variants_data AS (
        -- 2. Lấy Variant + Ảnh variant + Attributes (Giữ nguyên logic tốt của bạn)
        SELECT 
          v.id, 
          v.sku, 
          v.price::float as price, 
          v.stock,
          (
            SELECT image_url 
            FROM product_images 
            WHERE variant_id = v.id AND is_active = true 
            LIMIT 1
          ) as variant_image,
          jsonb_object_agg(a.name, av.value) FILTER (WHERE a.id IS NOT NULL) as attributes
        FROM product_variants v
        LEFT JOIN variant_attribute_values vav ON v.id = vav.variant_id
        LEFT JOIN attribute_values av ON vav.attribute_value_id = av.id
        LEFT JOIN attributes a ON av.attribute_id = a.id
        WHERE v.product_id = (SELECT id FROM target_product) 
          AND v.is_active = true
        GROUP BY v.id, v.sku, v.price, v.stock
      ),

      unique_attributes AS (
        -- 3. Lấy Attributes để render nút chọn
        SELECT 
          a.id, 
          a.name,
          jsonb_agg(
            DISTINCT jsonb_build_object('id', av.id, 'value', av.value)
          ) as values
        FROM attributes a
        JOIN attribute_values av ON a.id = av.attribute_id
        JOIN variant_attribute_values vav ON av.id = vav.attribute_value_id
        JOIN product_variants v ON vav.variant_id = v.id
        WHERE v.product_id = (SELECT id FROM target_product)
        GROUP BY a.id, a.name
      ),

      images_data AS (
        -- 4. Lấy TẤT CẢ ảnh liên quan
        SELECT 
          jsonb_agg(
            jsonb_build_object(
              'id', id, 
              'url', image_url, 
              'is_thumbnail', is_thumbnail,
              'variant_id', variant_id,
              'display_order', display_order
            ) ORDER BY is_thumbnail DESC, display_order ASC
          ) as images
        FROM product_images
        WHERE (product_id = (SELECT id FROM target_product) 
               OR variant_id IN (SELECT id FROM product_variants WHERE product_id = (SELECT id FROM target_product)))
          AND is_active = true
      )

      -- 5. Tổng hợp (Đã bao gồm category_id trong object product)
      SELECT 
        jsonb_build_object(
          'product', (
            SELECT jsonb_build_object(
              'id', tp.id, 
              'name', tp.name, 
              'slug', tp.slug, 
              'description', tp.description, 
              'short_description', tp.short_description,
              'thumbnail_url', tp.thumbnail_url,
              'category_id', tp.category_id, -- Thêm vào đây
              'price_min', (SELECT MIN(price) FROM product_variants WHERE product_id = tp.id AND is_active = true)
            ) FROM target_product tp
          ),
          'variants', COALESCE((SELECT jsonb_agg(v) FROM variants_data v), '[]'::jsonb),
          'attributes', COALESCE((SELECT jsonb_agg(ua) FROM unique_attributes ua), '[]'::jsonb),
          'images', COALESCE((SELECT images FROM images_data), '[]'::jsonb)
        ) as data
      FROM target_product;
    `;

    if (!rows || rows.length === 0) return null;
    return rows[0].data as ProductFull;

  } catch (err) {
    console.error("SQL Error in getProductDetail_slug:", err);
    throw new Error("Database fetch failed");
  }
}





