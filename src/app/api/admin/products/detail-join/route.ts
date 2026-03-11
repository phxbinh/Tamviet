import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

async function GET_() {
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

export async function GET() {
  try {
    const result = await sql`
      select
        p.id,
        p.name,
        p.slug,
        p.status,
        p.created_at,
        -- Lấy cột name từ bảng product_types và đặt alias
        pt.name as product_type_name,
        -- Các hàm aggregate để tính toán dữ liệu từ variants
        coalesce(sum(v.stock), 0) as total_stock,
        coalesce(min(v.price), 0) as min_price,
        coalesce(max(v.price), 0) as max_price,
        count(v.id) as variant_count
      from products p
      -- Sửa lại liên kết: product_types.id = products.product_type_id
      left join product_types pt on pt.id = p.product_type_id
      left join product_variants v on v.product_id = p.id
      -- Lưu ý: Group by p.id và pt.name (cần thiết cho PostgreSQL khi dùng Join)
      group by p.id, pt.name
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


 async function GET__(req: Request) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('type');
  const status = searchParams.get('status');

  try {
    const result = await sql`
      select
        p.id, p.name, p.slug, p.status, p.created_at,
        pt.name as product_type_name,
        coalesce(sum(v.stock), 0) as total_stock,
        coalesce(min(v.price), 0) as min_price,
        coalesce(max(v.price), 0) as max_price,
        count(v.id) as variant_count
      from products p
      left join product_types pt on pt.id = p.product_type_id
      left join product_variants v on v.product_id = p.id
      where 1=1
        ${typeId ? sql`and p.product_type_id = ${typeId}` : sql``}
        ${status ? sql`and p.status = ${status}` : sql``}
      group by p.id, pt.name
      order by p.created_at desc
    `;
    return NextResponse.json(result);
  } catch (err) { /* ... error handling ... */ }
}








