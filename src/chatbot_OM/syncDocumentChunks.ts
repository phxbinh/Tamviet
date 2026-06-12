import { eq } from "drizzle-orm";

import { db } from "../dbchatbot";

import {
  documentSections,
  documentChunks,
} from "./schemas";

import {
  chunkSections,
} from "./chunkSections_Sec";

import {
  SectionRecord,
} from "./buildSectionRecords";

export async function syncDocumentChunks(
  documentId: string
) {
  //----------------------------------
  // Load sections
  //----------------------------------

  const sections =
    await db
      .select()
      .from(
        documentSections
      )
      .where(
        eq(
          documentSections.documentId,
          documentId
        )
      );

  //----------------------------------
  // Delete old chunks
  //----------------------------------

  await db
    .delete(
      documentChunks
    )
    .where(
      eq(
        documentChunks.documentId,
        documentId
      )
    );

  //----------------------------------
  // Convert DB rows
  //----------------------------------

  const sectionRecords: SectionRecord[] =
    sections.map(
      (section) => ({
        level:
          section.level,

        title:
          section.title,

        sectionPath:
          section.sectionPath,

        pathSlug:
          section.pathSlug,

        content:
          section.content ??
          "",

        parentPath:
          null,

        sortOrder:
          section.sortOrder,
      })
    );

  //----------------------------------
  // Build chunks
  //----------------------------------

  const chunks =
    chunkSections(
      sectionRecords
    );

  //----------------------------------
  // sectionPath -> sectionId
  //----------------------------------

  const sectionMap =
    new Map(
      sections.map(
        (section) => [
          section
            .sectionPath,
          section.id,
        ]
      )
    );

  //----------------------------------
  // Insert chunks
  //----------------------------------

  if (
    chunks.length > 0
  ) {
    await db
      .insert(
        documentChunks
      )
      .values(
        chunks.map(
          (chunk) => ({
            documentId,

            sectionId:
              sectionMap.get(
                chunk.sectionPath
              )!,

            chunkIndex:
              chunk.chunkIndex,

            content:
              chunk.content,

            tokenCount:
              chunk.tokenCount,

            metadata: {},
          })
        )
      );
  }

  return {
    chunkCount:
      chunks.length,
  };
}