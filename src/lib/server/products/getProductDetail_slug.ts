// src/lib/server/products/getProductDetail_slug.ts
import "server-only"
import { sql } from "@/lib/neon/sql";

// ... interface ...
interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface Variant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
}


interface Product {
  id: string;
  name: string;
  thumbnail_url?: string;
  price_min?: number;
  short_description?: string;
  description?: string;
  category_id: string; // Thêm dòng này
}



interface ProductFull {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: ProductImage[];
}

export async function getProductDetail_slug_OK(slug: string): Promise<ProductFull | null> {
  try {
    const rows = await sql`
      WITH target_product AS (
        -- 1. Lấy thông tin sản phẩm gốc và category
        SELECT p.id, p.name, p.thumbnail_url, p.slug, p.description, 
               (SELECT category_id FROM product_categories WHERE product_id = p.id LIMIT 1) as category_id
        FROM products p
        WHERE p.slug = ${slug} AND p.status = 'active'
        LIMIT 1
      ),
      variants_data AS (
        -- 2. Lấy toàn bộ variants và attributes của chúng trong 1 lần join
        SELECT 
          v.product_id,
          v.id, v.sku, v.price, v.stock,
          jsonb_object_agg(a.name, av.value) FILTER (WHERE a.id IS NOT NULL) as attributes
        FROM product_variants v
        LEFT JOIN variant_attribute_values vav ON v.id = vav.variant_id
        LEFT JOIN attribute_values av ON vav.attribute_value_id = av.id
        LEFT JOIN attributes a ON av.attribute_id = a.id
        WHERE v.product_id = (SELECT id FROM target_product) AND v.is_active = true
        GROUP BY v.product_id, v.id
      ),
      unique_attributes AS (
        -- 3. Lấy danh sách thuộc tính duy nhất để hiển thị bộ lọc (Filter)
        SELECT 
          a.id, a.name,
          jsonb_agg(DISTINCT jsonb_build_object('id', av.id, 'value', av.value)) as values
        FROM attributes a
        JOIN attribute_values av ON a.id = av.attribute_id
        JOIN variant_attribute_values vav ON av.id = vav.attribute_value_id
        JOIN product_variants v ON vav.variant_id = v.id
        WHERE v.product_id = (SELECT id FROM target_product) AND v.is_active = true
        GROUP BY a.id, a.name
      ),
      images_data AS (
        -- 4. Gom nhóm images
        SELECT 
          product_id,
          jsonb_agg(
            jsonb_build_object('id', id, 'url', image_url, 'is_thumbnail', is_thumbnail)
            ORDER BY is_thumbnail DESC, id
          ) as images
        FROM product_images
        WHERE product_id = (SELECT id FROM target_product)
        GROUP BY product_id
      )
      -- 5. Tổng hợp tất cả thành 1 Object duy nhất
      SELECT 
        jsonb_build_object(
          'product', (SELECT row_to_json(target_product.*) FROM target_product),
          'variants', COALESCE((SELECT jsonb_agg(variants_data.*) FROM variants_data), '[]'::jsonb),
          'attributes', COALESCE((SELECT jsonb_agg(unique_attributes.*) FROM unique_attributes), '[]'::jsonb),
          'images', COALESCE((SELECT images FROM images_data), '[]'::jsonb)
        ) as data
      FROM target_product;
    `;

    if (!rows || rows.length === 0) return null;
    return rows[0].data;

  } catch (err) {
    console.error("Optimized Product Fetch Error:", err);
    throw new Error("Failed to fetch product detail");
  }
}



export async function getProductDetail_slug(slug: string): Promise<ProductFull | null> {
  try {
    const rows = await sql`
      WITH target_product AS (
        -- 1. Lấy thông tin sản phẩm gốc và category
        SELECT 
          p.id, 
          p.name, 
          p.thumbnail_url, 
          p.slug, 
          p.description, 
          p.short_description,
          (
            SELECT category_id 
            FROM product_categories 
            WHERE product_id = p.id 
            LIMIT 1
          ) as category_id
        FROM products p
        WHERE p.slug = ${slug} 
          AND p.status = 'active'
        LIMIT 1
      ),

      variants_data AS (
        -- 2. Lấy toàn bộ variants + attributes
        SELECT 
          v.product_id,
          v.id, 
          v.sku, 
          v.price, 
          v.stock,
          jsonb_object_agg(a.name, av.value) 
            FILTER (WHERE a.id IS NOT NULL) as attributes
        FROM product_variants v
        LEFT JOIN variant_attribute_values vav ON v.id = vav.variant_id
        LEFT JOIN attribute_values av ON vav.attribute_value_id = av.id
        LEFT JOIN attributes a ON av.attribute_id = a.id
        WHERE v.product_id = (SELECT id FROM target_product) 
          AND v.is_active = true
        GROUP BY v.product_id, v.id
      ),

      -- 🔥 NEW: tính giá thấp nhất
      price_data AS (
        SELECT 
          product_id,
          MIN(price) FILTER (WHERE stock > 0) as price_min
        FROM product_variants
        WHERE product_id = (SELECT id FROM target_product)
          AND is_active = true
        GROUP BY product_id
      ),

      unique_attributes AS (
        -- 3. Lấy attributes để render filter
        SELECT 
          a.id, 
          a.name,
          jsonb_agg(
            DISTINCT jsonb_build_object(
              'id', av.id, 
              'value', av.value
            )
          ) as values
        FROM attributes a
        JOIN attribute_values av ON a.id = av.attribute_id
        JOIN variant_attribute_values vav ON av.id = vav.attribute_value_id
        JOIN product_variants v ON vav.variant_id = v.id
        WHERE v.product_id = (SELECT id FROM target_product) 
          AND v.is_active = true
        GROUP BY a.id, a.name
      ),

      images_data AS (
        -- 4. Gom nhóm images
        SELECT 
          product_id,
          jsonb_agg(
            jsonb_build_object(
              'id', id, 
              'url', image_url, 
              'is_thumbnail', is_thumbnail
            )
            ORDER BY is_thumbnail DESC, id
          ) as images
        FROM product_images
        WHERE product_id = (SELECT id FROM target_product)
        GROUP BY product_id
      )

      -- 5. Tổng hợp
      SELECT 
        jsonb_build_object(
          'product', (
            SELECT row_to_json(tp)
            FROM (
              SELECT 
                tp.*,
                pd.price_min
              FROM target_product tp
              LEFT JOIN price_data pd 
                ON pd.product_id = tp.id
            ) tp
          ),

          'variants', COALESCE(
            (SELECT jsonb_agg(variants_data.*) FROM variants_data), 
            '[]'::jsonb
          ),

          'attributes', COALESCE(
            (SELECT jsonb_agg(unique_attributes.*) FROM unique_attributes), 
            '[]'::jsonb
          ),

          'images', COALESCE(
            (SELECT images FROM images_data), 
            '[]'::jsonb
          )
        ) as data
      FROM target_product;
    `;

    if (!rows || rows.length === 0) return null;

    return rows[0].data;

  } catch (err) {
    console.error("Optimized Product Fetch Error:", err);
    throw new Error("Failed to fetch product detail");
  }
}


