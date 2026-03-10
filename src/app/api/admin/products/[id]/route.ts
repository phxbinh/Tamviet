//src/app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { assertAdmin } from '@/lib/auth/assertAdmin';
import { sql } from '@/lib/neon/sql';
import { ForbiddenError } from '@/lib/errors';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
  
    // Kiểm tra quyền admin
    await assertAdmin(user.id);

    // Đây là id của product
    const { id } = await context.params

    const result = await sql`
      select *
      from products
      where id = ${id}
      limit 1
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (err) {
    console.error(err)
    if (err instanceof ForbiddenError) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    //throw err; // 500
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    //await assertAdmin()

    const { id } = await context.params

    const body = await req.json()

    const {
      name,
      slug,
      product_type,
      short_description,
      description,
      status
    } = body

    if (!name || !slug || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await sql`
      update products
      set
        name = ${name},
        slug = lower(${slug}),
        product_type = ${product_type},
        short_description = ${short_description},
        description = ${description},
        status = ${status}
      where id = ${id}
      returning *
    `

    return NextResponse.json(result[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    )
  }
}



