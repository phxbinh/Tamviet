// services/searchProducts.ts

import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { sql, desc } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm";


export async function POST(query: string) {

}

//export 
async function searchProducts(query: string) {
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
      score: similarity,
    })
    .from(productDocuments)
    .orderBy(desc(similarity))
    .limit(5);

  return results;
}