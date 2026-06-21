import { google } from "@ai-sdk/google";
import { embed } from "ai";
import { db } from "@/dbchatbot";
import {
  assets,
  documents,
  documentChunks
} from "@/chatbot_OM/schemas";
import { eq, sql } from "drizzle-orm";

export async function searchKnowledgeBase(
  query: string,
  limit = 4
) {
  const { embedding } = await embed({
    model: google.embedding(
      "gemini-embedding-001",
      {
        outputDimensionality: 3072
      }
    ),
    value: query
  });

  const similarity = sql<number>`
    1 - (
      ${documentChunks.embedding}
      <=>
      ${JSON.stringify(embedding)}::vector
    )
  `;

  return db
    .select({
      id: documentChunks.id,
      sectionPath:
        documentChunks.sectionPath,
      content: documentChunks.content,
      score: similarity,
      documentTitle: documents.title,
      assetName: assets.name
    })
    .from(documentChunks)
    .innerJoin(
      documents,
      eq(
        documentChunks.documentId,
        documents.id
      )
    )
    .innerJoin(
      assets,
      eq(
        documents.assetId,
        assets.id
      )
    )
    .where(sql`${similarity} > 0.4`)
    .orderBy(
      sql`
        ${documentChunks.embedding}
        <=>
        ${JSON.stringify(embedding)}::vector
      `
    )
    .limit(limit);
}