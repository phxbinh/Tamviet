//src/app/api/admin/product-type-attributes/route.ts
import { NextResponse } from "next/server"
import { sql } from "@/lib/neon/sql"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const {
      product_type_code,
      attribute_codes
    }: {
      product_type_code: string
      attribute_codes: string[]
    } = body

    if (
      !product_type_code ||
      !Array.isArray(attribute_codes) ||
      attribute_codes.length === 0
    ) {
      return NextResponse.json(
        { error: "product_type_code and attribute_codes are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      insert into product_type_attributes (product_type_id, attribute_id)
      select pt.id, a.id
      from product_types pt
      join attributes a
        on a.code = any(${attribute_codes})
      where pt.code = ${product_type_code}
      on conflict do nothing
      returning product_type_id, attribute_id;
    `

    return NextResponse.json({
      inserted: result.length
    })

  } catch (err: any) {
    console.error(err)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}