// services/rebuildProductEmbeddings.ts

/*
import { db } from "./index";
import { productDocuments } from "./schema";
import { getProductsForEmbedding } from "./getProductsForEmbedding";
import { buildProductDocument } from "./buildProductDoc";
import { embed } from "ai";
import { google } from "@ai-sdk/google";



type Variant = {
  price: number;
  stock: number;
  attributes: { name: string; value: string }[];
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id?: string;
  variants: Variant[];
};

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
      const doc = buildProductDocument(p as ProductRow);

      const embeddingRes = await embed({
        model: google.embedding("gemini-embedding-001"),
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
*/


import { db } from "./index";
import { productDocuments } from "./schema";
import { getProductsForEmbedding } from "./getProductsForEmbedding";
import { buildProductDocument } from "./buildProductDoc";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { sql } from "drizzle-orm";


function parseJsonField(field: any) {
  if (!field) return [];
  if (typeof field === "string") return JSON.parse(field);
  return field;
}

function normalizeProductRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,

    categories: parseJsonField(row.categories),
    variants: parseJsonField(row.variants),
  };
}


export async function rebuildProductEmbeddings() {
  const products = await getProductsForEmbedding();

  const batchSize = 10;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);

    const insertData = [];

    for (const raw of batch) {
      const p = normalizeProductRow(raw);

      const doc = buildProductDocument(p);

      const embeddingRes = await embed({
        model: google.embedding("gemini-embedding-001"), // 👉 dùng 768 cho ổn định
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

    // ✅ UPSERT (quan trọng nhất)
    await db
      .insert(productDocuments)
      .values(insertData)
      .onConflictDoUpdate({
        target: productDocuments.productId,
        set: {
          title: sql`excluded.title`,
          slug: sql`excluded.slug`,
          content: sql`excluded.content`,
          metadata: sql`excluded.metadata`,
          embedding: sql`excluded.embedding`,
        },
      });

    console.log(`Inserted batch ${i / batchSize + 1}`);
  }

  return { success: true };
}










