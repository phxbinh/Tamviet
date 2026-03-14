// src/lib/db/products.ts
import { sql } from "@/lib/neon/sql";

export async function getProductsByCategory(slug?: string) {

  // CASE 1: tất cả products
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

  if (!cat.length) {
    return null;
  }

  const path = cat[0].category_path;

  // CASE 3: products theo tree
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