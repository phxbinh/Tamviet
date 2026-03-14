
/* Lấy tất cả các sản phẩm */
// src/app/api/products/categories/route.ts

import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";

/*
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
*/


/*
export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("category");

    if (!slug) {
      const rows = await sql`
        select *
        from products
        order by created_at desc
      `;

      return Response.json({
        success: true,
        data: rows
      });
    }

    const cat = await sql`
      select category_path
      from categories
      where category_path = ${slug}
      limit 1
    `;

    if (!cat.length) {
      return Response.json(
        { success:false, error:"Category not found" },
        { status:404 }
      );
    }

    const path = cat[0].category_path;

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

    return Response.json({
      success: true,
      data: rows
    });

  } catch (error) {

    return Response.json(
      { success:false, error:"Failed to fetch products" },
      { status:500 }
    );
  }
}
*/




export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("category")

    // CASE 1: lấy tất cả products
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
      `

      return Response.json({
        success: true,
        data: rows
      })
    }

    // CASE 2: tìm category path
    const cat = await sql`
      select category_path
      from categories
      where category_path = ${slug}
      limit 1
    `

    if (!cat.length) {
      return Response.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    const path = cat[0].category_path

    // CASE 3: lấy products theo category tree
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
    `

    return Response.json({
      success: true,
      data: rows
    })

  } catch (error) {

    return Response.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    )

  }
}










