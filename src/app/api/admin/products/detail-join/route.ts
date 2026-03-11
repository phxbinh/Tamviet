import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET() {
  try {
    // Truy vấn kết hợp bảng products và product_variants
    const result = await sql`
      select
        p.id,
        p.name,
        p.slug,
        p.status,
        p.product_type,
        p.created_at,
        coalesce(sum(v.stock), 0) as total_stock,
        coalesce(min(v.price), 0) as min_price,
        coalesce(max(v.price), 0) as max_price,
        count(v.id) as variant_count
      from products p
      left join product_variants v on v.product_id = p.id
      group by p.id
      order by p.created_at desc
    `;

    return NextResponse.json(result);
  } catch (err) {
    console.error("Admin products fetch error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
