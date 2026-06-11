import { db } from "../../dbchatbot";

import {
  documents,
} from "../schemas";

import {
  desc,
} from "drizzle-orm";

export async function listDocuments() {
  return db
    .select({
      id: documents.id,

      assetId:
        documents.assetId,

      title:
        documents.title,

      documentType:
        documents.documentType,

      version:
        documents.version,

      createdAt:
        documents.createdAt,

      updatedAt:
        documents.updatedAt,
    })
    .from(documents)
    .orderBy(
      desc(
        documents.createdAt
      )
    );
}