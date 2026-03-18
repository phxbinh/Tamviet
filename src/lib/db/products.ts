// src/lib/db/products.ts
/*
import "server-only";
import { sql } from "@/lib/neon/sql";
import { cache } from "react";

async function getProductsByCategoryCached(slug?: string) {

  // CASE 1: không có category
  if (!slug) {
    const rows = await sql`
      select
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url,
        min(v.price) as price_min,
        sum(v.stock) as total_stock,
        img.image_url as thumbnail
      from products p
      left join product_variants v
        on v.product_id = p.id
        and v.is_active = true
      left join product_images img
        on img.product_id = p.id
        and img.is_thumbnail = true
      where p.status = 'active'
      group by
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url,
        img.image_url
      order by p.created_at desc
    `;

    return rows;
  }

  // CASE 2: tìm category
  const cat = await sql`
    select category_path
    from categories
    where category_path = ${slug}
    limit 1
  `;

  if (!cat.length) return null;

  const path = cat[0].category_path;

  // CASE 3: products theo category tree
  const rows = await sql`
    select
      p.id,
      p.name,
      p.slug,
      p.thumbnail_url,
      min(v.price) as price_min,
      sum(v.stock) as total_stock,
      img.image_url as thumbnail
    from products p
    join product_categories pc
      on pc.product_id = p.id
    join categories c
      on c.id = pc.category_id
    left join product_variants v
      on v.product_id = p.id
      and v.is_active = true
    left join product_images img
      on img.product_id = p.id
      and img.is_thumbnail = true
    where
      p.status = 'active'
      and c.category_path like ${path + '%'}
    group by
      p.id,
      p.name,
      p.slug,
      p.thumbnail_url,
      img.image_url
    order by p.created_at desc
  `;

  return rows;
}

export const getProductsByCategory = cache(getProductsByCategoryCached);
*/

// src/lib/db/products.ts

async function getProductsByCategoryCached(
  slug?: string,
  limit = 20,
  offset = 0
) {
  try {
    // ===============================
    // CASE 1: KHÔNG CATEGORY
    // ===============================
    if (!slug) {
      const rows = await sql`
        WITH variant_data AS (
          SELECT
            product_id,
            MIN(price) AS price_min,
            SUM(stock) AS total_stock
          FROM product_variants
          WHERE is_active = true
          GROUP BY product_id
        ),
        thumbnail AS (
          SELECT DISTINCT ON (product_id)
            product_id,
            image_url
          FROM product_images
          WHERE is_thumbnail = true
        )
        SELECT
          p.id,
          p.name,
          p.slug,
          p.thumbnail_url,
          vd.price_min,
          vd.total_stock,
          t.image_url AS thumbnail
        FROM products p
        LEFT JOIN variant_data vd ON vd.product_id = p.id
        LEFT JOIN thumbnail t ON t.product_id = p.id
        WHERE p.status = 'active'
        ORDER BY p.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      return rows;
    }

    // ===============================
    // CASE 2: CÓ CATEGORY
    // ===============================
    const cat = await sql`
      select category_path
      from categories
      where category_path = ${slug}
      limit 1
    `;

    if (!cat.length) return [];

    const path = cat[0].category_path;

    const rows = await sql`
      WITH variant_data AS (
        SELECT
          product_id,
          MIN(price) AS price_min,
          SUM(stock) AS total_stock
        FROM product_variants
        WHERE is_active = true
        GROUP BY product_id
      ),
      thumbnail AS (
        SELECT DISTINCT ON (product_id)
          product_id,
          image_url
        FROM product_images
        WHERE is_thumbnail = true
      )
      SELECT
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url,
        vd.price_min,
        vd.total_stock,
        t.image_url AS thumbnail
      FROM products p

      JOIN product_categories pc 
        ON pc.product_id = p.id

      JOIN categories c 
        ON c.id = pc.category_id

      LEFT JOIN variant_data vd 
        ON vd.product_id = p.id

      LEFT JOIN thumbnail t 
        ON t.product_id = p.id

      WHERE 
        p.status = 'active'
        AND c.category_path LIKE ${path + "%"}
        
      ORDER BY p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return rows;

  } catch (err) {
    console.error("getProductsByCategory error:", err);
    return [];
  }
}

