// src/app/api/admin/products/detail-join/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

// Chạy được với filter
//export
async function GET__(req: Request) {
  // 1. PHẢI CÓ DÒNG NÀY: Lấy tham số từ URL
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('type');   // <-- Khai báo typeId ở đây
  const status = searchParams.get('status'); // <-- Khai báo status ở đây

  try {
    // 2. Bây giờ biến typeId và status mới tồn tại để dùng trong này
    const result = await sql`
      select
        p.id,
        p.name,
        p.slug,
        p.status,
        p.created_at,
        pt.name as product_type_name,
        coalesce(sum(v.stock), 0) as total_stock,
        coalesce(min(v.price), 0) as min_price,
        coalesce(max(v.price), 0) as max_price,
        count(v.id) as variant_count
      from products p
      left join product_types pt on pt.id = p.product_type_id
      left join product_variants v on v.product_id = p.id
      where 
        (${typeId}::text is null or p.product_type_id = ${typeId})
        and (${status}::text is null or p.status = ${status})
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




//////////

export async function GET(req: Request) {
  // 1. PHẢI CÓ DÒNG NÀY: Lấy tham số từ URL
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('type');
  const status = searchParams.get('status');
  const query = searchParams.get('q');

  try {
    // 2. Bây giờ biến typeId và status mới tồn tại để dùng trong này
    const result = await sql`
      select
        p.id,
        p.name,
        p.slug,
        p.status,
        p.created_at,
        pt.name as product_type_name,
        coalesce(sum(v.stock), 0) as total_stock,
        coalesce(min(v.price), 0) as min_price,
        coalesce(max(v.price), 0) as max_price,
        count(v.id) as variant_count
      from products p
      left join product_types pt on pt.id = p.product_type_id
      left join product_variants v on v.product_id = p.id
      where 
        (${typeId}::text is null or p.product_type_id = ${typeId})
        and (${status}::text is null or p.status = ${status})
        and (${query}::text is null or p.name ilike ${'%' + query + '%'} or p.slug ilike ${'%' + query + '%'})
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





/*
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('type');
  const status = searchParams.get('status');
  const query = searchParams.get('q'); // Lấy tham số tìm kiếm

  try {
    const result = await sql`
      select p.*, pt.name as product_type_name, ... -- (Các cột cũ giữ nguyên)
      from products p
      -- ... (Các join cũ giữ nguyên)
      where 
        (${typeId}::text is null or p.product_type_id = ${typeId})
        and (${status}::text is null or p.status = ${status})
        -- Thêm logic tìm kiếm theo tên hoặc slug
        and (${query}::text is null or p.name ilike ${'%' + query + '%'} or p.slug ilike ${'%' + query + '%'})
      group by p.id, pt.name
      order by p.created_at desc
    `;
    return NextResponse.json(result);
  } catch (err) {  }
}
*/




