// src/app/api/products/route.tsx
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET() {
  try {
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

    return NextResponse.json(rows);

  } catch (error) {
    console.error("products api error:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}