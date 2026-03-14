import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);

    const slug = searchParams.get("category");

    // 1️⃣ Không có category → lấy toàn bộ product
    if (!slug) {

      const rows = await sql`
        select *
        from products
        order by created_at desc
      `;

      return NextResponse.json({
        success: true,
        data: rows
      });
    }

    // 2️⃣ tìm category_path
    const cat = await sql`
      select category_path
      from categories
      where slug = ${slug}
      limit 1
    `;

    if (!cat.length) {
      return NextResponse.json(
        { success:false, error:"Category not found" },
        { status:404 }
      );
    }

    const path = cat[0].category_path;

    // 3️⃣ lấy products thuộc category + children
    const rows = await sql`

      select distinct p.*
      from products p

      join product_categories pc
        on pc.product_id = p.id

      join categories c
        on c.id = pc.category_id

      where c.category_path like ${path + '%'}
      order by p.created_at desc

    `;

    return NextResponse.json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success:false, error:"Failed to fetch products" },
      { status:500 }
    );
  }
}