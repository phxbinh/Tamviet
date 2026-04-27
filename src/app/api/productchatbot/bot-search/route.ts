// services/searchProducts.ts
/*
import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { sql, desc } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm";
*/

// app/api/productchatbot/bot-search/route.ts

import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { sql, desc } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query?.trim();

    if (!query) {
      return NextResponse.json(
        { ok: false, error: "Missing query" },
        { status: 400 }
      );
    }

    const results = await searchProducts(query);

    return NextResponse.json({
      ok: true,
      results,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, error: "Search failed" },
      { status: 500 }
    );
  }
}




//export 
async function searchProducts(query: string) {
  // ⚠️ đồng bộ với DB (768 nếu mày dùng text-embedding-004)
  const embeddingRes = await embed({
    model: google.embedding("gemini-embedding-001"),
    value: query,
  });

  const similarity = sql<number>`
    1 - (${cosineDistance(
      productDocuments.embedding,
      embeddingRes.embedding
    )})
  `;

  const results = await db
    .select({
      title: productDocuments.title,
      slug: productDocuments.slug,
      content: productDocuments.content,
      metadata: productDocuments.metadata,
      score: similarity,
    })
    .from(productDocuments)
    .orderBy(desc(similarity))
    .limit(5);

  // 🔥 filter + format cho chatbot
  return results
    .filter((r) => r.score > 0.7) // tránh trả kết quả rác
    .map((r) => ({
      title: r.title,
      slug: r.slug,

      // 👉 link để mở tab mới
      url: `/products/${r.slug}`,

      score: r.score,

      // 👉 rút gọn content (tránh trả quá dài)
      preview: r.content.slice(0, 200) + "...",

      metadata: r.metadata,
    }));
}