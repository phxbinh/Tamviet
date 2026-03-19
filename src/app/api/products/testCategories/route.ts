// src/app/api//route.ts

import { NextResponse } from "next/server";
import { getProductsByCategory } from "@/lib/db/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;

  const products = await getProductsByCategory(category);

  return NextResponse.json(products);
}