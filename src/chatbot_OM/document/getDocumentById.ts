// services/documents/getDocumentById.ts

import { eq } from "drizzle-orm";

import { db } from "../../dbchatbot";

import { documents } from "../schemas";

export async function getDocumentById(
  documentId: string
) {
  const [document] =
    await db
      .select()
      .from(documents)
      .where(
        eq(
          documents.id,
          documentId
        )
      )
      .limit(1);

  return document ?? null;
}