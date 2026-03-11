import { NextResponse } from "next/server"
import { sqlAdmin } from "@/lib/neon/sql"

/* =========================
   PATCH
========================= */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()
    let { code, name } = body

    if (!code || !name) {
      return NextResponse.json(
        { error: "Code and name are required" },
        { status: 400 }
      )
    }

    code = code.toLowerCase().trim()

    const existing = await sqlAdmin`
      select id from attributes
      where code = ${code} and id != ${id}
    `
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 400 }
      )
    }

    const result = await sqlAdmin`
      update attributes
      set code = ${code},
          name = ${name}
      where id = ${id}
      returning id, code, name, created_at
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("PATCH attributes error:", error)
    return NextResponse.json(
      { error: "Failed to update attribute" },
      { status: 500 }
    )
  }
}

/* =========================
   DELETE
========================= */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const usedInProductType = await sqlAdmin`
      select count(*)::int as count
      from product_type_attributes
      where attribute_id = ${id}
    `
    if (usedInProductType[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete: attribute assigned to product type" },
        { status: 400 }
      )
    }

    const hasValues = await sqlAdmin`
      select count(*)::int as count
      from attribute_values
      where attribute_id = ${id}
    `
    if (hasValues[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete: attribute has values" },
        { status: 400 }
      )
    }

    const result = await sqlAdmin`
      delete from attributes
      where id = ${id}
      returning id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE attributes error:", error)
    return NextResponse.json(
      { error: "Failed to delete attribute" },
      { status: 500 }
    )
  }
}