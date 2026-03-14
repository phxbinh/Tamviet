
/* Lấy tất cả các sản phẩm */
// src/app/api/products/categories/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon/sql";
import { getProductsByCategory } from "@/lib/db/products";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("category") ?? undefined;

  const rows = await getProductsByCategory(slug);

  if (rows === null) {
    return Response.json(
      { success: false, error: "Category not found" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    data: rows
  });
}









