//src/app/api/admin/product-types/route.ts
import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon/sql";

// GET: list product types
export async function GET() {
  try {
    const rows = await sql`
      select id, code, name, created_at
      from product_types
      order by created_at desc
    `

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET product_types error:", error)
    return NextResponse.json(
      { error: "Failed to fetch product types" },
      { status: 500 }
    )
  }
}

// POST: create product type
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let { code, name } = body

    if (!code || !name) {
      return NextResponse.json(
        { error: "Code and name are required" },
        { status: 400 }
      )
    }

    code = code.toLowerCase().trim()

    // validate format
    const isValid = /^[a-z0-9_-]+$/.test(code)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      )
    }

    // check duplicate
    const existing = await sql`
      select id from product_types where code = ${code}
    `
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 400 }
      )
    }

    const result = await sql`
      insert into product_types (code, name)
      values (${code}, ${name})
      returning id, code, name, created_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("POST product_types error:", error)
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    )
  }
}