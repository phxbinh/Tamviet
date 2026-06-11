import { eq } from "drizzle-orm";

import { db } from "../dbchatbot";

import {
  documentSections,
} from "./schemas";

import {
  parseMarkdownToAST,
} from "./parseMarkdownToAST";

import {
  buildSectionRecords,
} from "./buildSectionRecords";

export interface SyncDocumentSectionsInput {
  documentId: string;
  markdown: string;
}

export async function syncDocumentSections(
  input: SyncDocumentSectionsInput
) {
  //----------------------------------
  // Parse markdown
  //----------------------------------

  const ast =
    parseMarkdownToAST(
      input.markdown
    );

  const sections =
    buildSectionRecords(ast);

  //----------------------------------
  // Delete old sections
  //----------------------------------

  await db
    .delete(documentSections)
    .where(
      eq(
        documentSections.documentId,
        input.documentId
      )
    );

  //----------------------------------
  // Insert new sections
  //----------------------------------

  const pathToId =
    new Map<string, string>();

  for (const section of sections) {
    const parentId =
      section.parentPath
        ? pathToId.get(
            section.parentPath
          ) ?? null
        : null;

    const [created] =
      await db
        .insert(
          documentSections
        )
        .values({
          documentId:
            input.documentId,

          parentId,

          level:
            section.level,

          title:
            section.title,

          sectionType:
            null,

          sectionPath:
            section.sectionPath,

          pathSlug:
            section.pathSlug,

          content:
            section.content,

          sortOrder:
            section.sortOrder,

          metadata: {},
        })
        .returning({
          id:
            documentSections.id,
        });

    pathToId.set(
      section.sectionPath,
      created.id
    );
  }

  return {
    sectionCount:
      sections.length,
  };
}