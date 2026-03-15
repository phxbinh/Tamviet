// src/lib/server/products/products.ts
// -> Chức năng lấy tất cả sản phẩm có status=active và thông số cần thiết để hiển thị lên productCard
// -> Chưa được sử dụng
import "server-only";
import { sql } from "@/lib/neon/sql";
import { cache } from "react";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
  price_min: number | null;
  total_stock: number | null;
  thumbnail: string | null;
};

async function getProducts(): Promise<ProductRow[]> {
  const [rows] = await sql`
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

  return rows as ProductRow;
}

export const getProductsCached = cache(getProducts);



