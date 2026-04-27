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

import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { sql, desc } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ chống crash nếu body rỗng
    const body = await req.json().catch(() => ({}));

    const query = body?.query?.trim();

    if (!query) {
      return NextResponse.json(
        { ok: false, error: "Query is required" },
        { status: 400 }
      );
    }

    const results = await searchProducts(query);

    return NextResponse.json({
      ok: true,
      results,
    });
  } catch (error) {
    console.error("SEARCH ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Search failed" },
      { status: 500 }
    );
  }
}




async function searchProducts(query: string) {
  // ✅ QUAN TRỌNG: đồng bộ với DB (768)
  const embeddingRes = await embed({
    model: google.embedding("text-embedding-004"),
    value: query,
  });

  const similarity = sql<number>`
    1 - (${cosineDistance(
      productDocuments.embedding,
      ${embeddingRes.embedding}
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
    .limit(10); // lấy dư rồi filter

  // ✅ filter + format an toàn
  return results
    .filter((r) => (r.score ?? 0) > 0.65)
    .map((r) => ({
      title: r.title,
      slug: r.slug,
      url: `/products/${r.slug}`,

      score: Number(r.score ?? 0),

      preview: r.content
        ? r.content.slice(0, 200) + "..."
        : "",

      metadata: r.metadata ?? {},
    }));
}