import crypto from "crypto";

import { db } from "../dbchatbot";

import { documents } from "./schemas";

import {
  eq,
} from "drizzle-orm";


import {
  syncDocumentSections,
} from "./syncDocumentSections";

import {
  syncDocumentChunks,
} from "./syncDocumentChunks";


export interface UpdateDocumentInput {
  documentId: string;
  title?: string;
  documentType?: string;
  version?: string;
  markdown?: string;
  metadata?: Record<
    string,
    unknown
  >;
}

export async function updateDocument(
  input: UpdateDocumentInput
) {
  const updateData: Record<
    string,
    unknown
  > = {};

  if (
    input.title !== undefined
  ) {
    updateData.title =
      input.title;
  }

  if (
    input.documentType !==
    undefined
  ) {
    updateData.documentType =
      input.documentType;
  }

  if (
    input.version !==
    undefined
  ) {
    updateData.version =
      input.version;
  }

  if (
    input.metadata !==
    undefined
  ) {
    updateData.metadata =
      input.metadata;
  }

  if (
    input.markdown !==
    undefined
  ) {
    updateData.rawMarkdown =
      input.markdown;

    updateData.contentHash =
      crypto
        .createHash("sha256")
        .update(
          input.markdown
        )
        .digest("hex");
  }

  const [document] =
    await db
      .update(documents)
      .set(updateData)
      .where(
        eq(
          documents.id,
          input.documentId
        )
      )
      .returning();

  if (!document) {
    throw new Error(
      "Document not found"
    );
  }

  if (input.markdown !== undefined) {
    await syncDocumentSections({
      documentId:
        input.documentId,
      markdown:
        input.markdown,
    });
  }

  await syncDocumentChunks(
      input.documentId
    );

  return document;
}