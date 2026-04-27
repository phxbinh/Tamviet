// app/api/productchatbot/add-embed/route.ts

import { NextResponse } from "next/server";
import { rebuildProductEmbeddings } from "@/productchatbot/rebuildProductsEmbeddings";

export async function POST() {
  try {
    const result = await rebuildProductEmbeddings();

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, error: "Failed to rebuild embeddings" },
      { status: 500 }
    );
  }
}