
import { embed } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "../dbchatbot";

import {
  documentChunks,
} from "./schemas";

import {
  eq,
  isNull,
} from "drizzle-orm";

export async function generateDocumentEmbeddings(
  documentId: string
) {
  //----------------------------------
  // Load chunks
  //----------------------------------

/* Lấy tất cả các chunks */
  const chunks =
    await db
      .select()
      .from(
        documentChunks
      )
      .where(
        eq(
          documentChunks.documentId,
          documentId
        )
      );

/*
Lấy các chunks chưa embbeding
const chunks =
  await db
    .select()
    .from(documentChunks)
    .where(
      and(
        eq(
          documentChunks.documentId,
          documentId
        ),
        isNull(
          documentChunks.embedding
        )
      )
    );
*/

  //----------------------------------
  // Generate embeddings
  //----------------------------------

  for (const chunk of chunks) {
    const result =
      await embed({
        model:
          google.embedding(
            "gemini-embedding-001"
          ),

        value:
          chunk.content,
      });

    await db
      .update(
        documentChunks
      )
      .set({
        embedding:
          result.embedding,
      })
      .where(
        eq(
          documentChunks.id,
          chunk.id
        )
      );
  }

  return {
    chunkCount:
      chunks.length,
  };
}