import crypto from "crypto";

import { db } from "../dbchatbot";

import { documents } from "./schemas";

import {
  parseMarkdownToAST,
} from "./parseMarkdownToAST";

export interface ImportDocumentInput {
  assetId: string;
  documentType: string;
  title?: string;
  version?: string;
  markdown: string;
  metadata?: Record<string, unknown>;
}

export async function insertDocument(
  input: ImportDocumentInput
) {
  //----------------------------------
  // Parse title
  //----------------------------------

  const ast =
    parseMarkdownToAST(
      input.markdown
    );

  //----------------------------------
  // Hash
  //----------------------------------

  const contentHash =
    crypto
      .createHash("sha256")
      .update(input.markdown)
      .digest("hex");

  //----------------------------------
  // Insert document
  //----------------------------------

  const [document] =
    await db
      .insert(documents)
      .values({
        assetId:
          input.assetId,

        documentType:
          input.documentType,

        title:
          input.title ??
          ast.title,

        version:
          input.version,

        rawMarkdown:
          input.markdown,

        contentHash,

        metadata:
          input.metadata ??
          {},
      })
      .returning();

  return document;
}