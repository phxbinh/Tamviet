import { NextResponse } from "next/server"
import { sql } from "@/lib/neon/sql"

/* =========================
   GET
========================= */
export async function GET() {
  try {
    const result = await sql`
      select id, code, name, type, created_at
      from attributes
      order by created_at desc
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("GET attributes error:", error)
    return NextResponse.json(
      { error: "Failed to fetch attributes" },
      { status: 500 }
    )
  }
}

/* =========================
   POST
========================= */
export async function POST(req: Request) {
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

    const isValid = /^[a-z0-9_-]+$/.test(code)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      )
    }

    const existing = await sql`
      select id from attributes where code = ${code}
    `
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 400 }
      )
    }

    const result = await sql`
      insert into attributes (code, name)
      values (${code}, ${name})
      returning id, code, name, created_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("POST attributes error:", error)
    return NextResponse.json(
      { error: "Failed to create attribute" },
      { status: 500 }
    )
  }
}