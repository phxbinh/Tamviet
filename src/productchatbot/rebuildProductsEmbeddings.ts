// services/rebuildProductEmbeddings.ts

import { db } from "@/db";
import { productDocuments } from "./schema";
import { getProductsForEmbedding } from "./getProductsForEmbedding";
import { buildProductDocument } from "./buildProductDoc";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

export async function rebuildProductEmbeddings() {
  // 1. lấy data
  const products = await getProductsForEmbedding();

  // 2. clear bảng (simple version)
  await db.delete(productDocuments);

  const batchSize = 10;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);

    const insertData = [];

    for (const p of batch) {
      const doc = buildProductDocument(p);

      const embeddingRes = await embed({
        model: google.embedding("text-embedding-004"),
        value: doc.content,
      });

      insertData.push({
        productId: doc.productId,
        title: doc.title,
        slug: doc.slug,
        content: doc.content,
        metadata: doc.metadata,
        embedding: embeddingRes.embedding,
      });
    }

    await db.insert(productDocuments).values(insertData);

    console.log(`Inserted batch ${i / batchSize + 1}`);
  }

  return { success: true };
}