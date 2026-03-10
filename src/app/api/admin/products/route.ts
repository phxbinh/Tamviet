//src/app/api/admin/products/route.ts
import { NextResponse } from "next/server"
import { sql } from '@/lib/neon/sql';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { assertAdmin } from '@/lib/authActions/assertAdmin';

import slugify from "slugify"

export async function POST(req: Request) {

  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Kiểm tra quyền admin
    await assertAdmin(user.id);

    const body = await req.json()

    const {
      name,
      slug,
      product_type_id,
      short_description,
      description
    } = body

    if (!name || !slug || !product_type_id) {
      return NextResponse.json(
        { error: "Name, slug and product type are required" },
        { status: 400 }
      )
    }

    const normalizedSlug = slugify(slug, { lower: true, strict: true })

    const result = await sql`
      insert into products (
        name,
        slug,
        product_type_id,
        short_description,
        description,
        status
      )
      values (
        ${name},
        ${normalizedSlug},
        ${product_type_id},
        ${short_description ?? null},
        ${description ?? null},
        'draft'
      )
      returning id;
    `

    return NextResponse.json({ id: result[0].id })

  } catch (err: any) {
    console.error(err)

    if (err.message?.includes("idx_products_slug_ci")) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/*
export async function GET() {
  try {
    //await assertAdmin()

    const result = await sql`
      select
        id,
        name,
        slug,
        status,
        product_type,
        created_at
      from products
      order by created_at desc
    `

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
*/

export async function GET() {
  try {
    const result = await sql`
      select
        p.id,
        p.name,
        p.slug,
        p.status,
        p.created_at,
        pt.id   as product_type_id,
        pt.name as product_type_name,
        pt.code as product_type_code
      from products p
      left join product_types pt
      on pt.id = p.product_type_id
      order by p.created_at desc
    `

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}











