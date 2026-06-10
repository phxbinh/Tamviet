/*
import { db } from "@/db";

import {
  documents,
  documentSections,
  documentChunks,
} from "@/db/schema";

import { parseMarkdownToAST } form "./parseMarkdownToAST";
import { buildSectionRecords } form "./buildSectionTree";
import { chunkSections } form "./chunkSections";

import { eq } from "drizzle-orm";
*/

// Rebuild

import crypto from "crypto";

import { db } from "../dbchatbot";
import { eq } from "drizzle-orm";

import {
  documents,
  documentSections,
  documentChunks,
} from "./schemas";

import {
  parseMarkdownToAST,
} from "./parseMarkdownToAST";

import {
  buildSectionRecords,
} from "./buildSectionRecords";

import {
  chunkSections,
} from "./chunkSections";


// Hash helper
//import crypto from "crypto";

export function sha256(
  text: string
): string {
  return crypto
    .createHash("sha256")
    .update(text)
    .digest("hex");
}

// Interfaces
// Input interface ---------
export interface ImportDocumentInput {
  assetId: string;

  documentType: string;

  title?: string;

  version?: string;

  markdown: string;

  metadata?: Record<string, unknown>;
}

// Output interface --------
export interface ImportDocumentResult {
  documentId: string;

  sectionCount: number;

  chunkCount: number;
}

export async function insertDocumentTree(

  input: ImportDocumentInput

) {

  let documentId: string | null = null;

  try {

    //----------------------------------

    // Parse

    //----------------------------------

    const ast = parseMarkdownToAST(

      input.markdown

    );

    const sections =

      buildSectionRecords(ast);

    const chunks =

      chunkSections(sections);

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

          assetId: input.assetId,

          documentType:

            input.documentType,

          title:

            input.title ??

            ast.title,

          version: input.version,

          rawMarkdown:

            input.markdown,

          contentHash,

          metadata:

            input.metadata ?? {},

        })

        .returning();

    documentId = document.id;

    //----------------------------------

    // Insert sections

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

      const [createdSection] =

        await db

          .insert(

            documentSections

          )

          .values({

            documentId:

              document.id,

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

          .returning();

      pathToId.set(

        section.sectionPath,

        createdSection.id

      );

    }

    //----------------------------------

    // Batch chunks

    //----------------------------------

    const chunkRows =

      chunks.map((chunk) => ({

        documentId:

          document.id,

        sectionId:

          pathToId.get(

            chunk.sectionPath

          )!,

        sectionPath:

          chunk.sectionPath,

        chunkIndex:

          chunk.chunkIndex,

        content:

          chunk.content,

        metadata: {},

      }));

    if (chunkRows.length > 0) {

      await db

        .insert(documentChunks)

        .values(chunkRows);

    }

    //----------------------------------

    // Result

    //----------------------------------

    return {

      documentId:

        document.id,

      sectionCount:

        sections.length,

      chunkCount:

        chunks.length,

    };

  } catch (error) {

    //----------------------------------

    // Manual rollback

    //----------------------------------

    if (documentId) {

      try {

        await db

          .delete(documents)

          .where(

            eq(

              documents.id,

              documentId

            )

          );

        // CASCADE:

        // document

        // -> sections

        // -> chunks

      } catch (

        rollbackError

      ) {

        console.error(

          "Rollback failed",

          rollbackError

        );

      }

    }

    throw error;

  }

}





/*
export async function insertDocumentTree(
  input: ImportDocumentInput
): Promise<ImportDocumentResult> {
  return db.transaction(
    async (tx) => {

      //--------------------------------
      // Parse
      //--------------------------------

      const ast =
        parseMarkdownToAST(
          input.markdown
        );

      const sections =
        buildSectionRecords(ast);

      const chunks =
        chunkSections(sections);

      //--------------------------------
      // Hash
      //--------------------------------

      const contentHash =
        crypto
          .createHash("sha256")
          .update(input.markdown)
          .digest("hex");

      //--------------------------------
      // Document
      //--------------------------------

      const [document] =
        await tx
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

      //--------------------------------
      // Sections
      //--------------------------------

      const pathToId =
        new Map<
          string,
          string
        >();

      for (const section of sections) {
        const parentId =
          section.parentPath
            ? pathToId.get(
                section.parentPath
              ) ?? null
            : null;

        const [created] =
          await tx
            .insert(
              documentSections
            )
            .values({
              documentId:
                document.id,

              parentId,

              level:
                section.level,

              title:
                section.title,

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
            .returning();

        pathToId.set(
          section.sectionPath,
          created.id
        );
      }

      //--------------------------------
      // Chunks
      //--------------------------------

      const chunkRows =
        chunks.map((chunk) => ({
          documentId:
            document.id,

          sectionId:
            pathToId.get(
              chunk.sectionPath
            )!,

          sectionPath:
            chunk.sectionPath,

          chunkIndex:
            chunk.chunkIndex,

          content:
            chunk.content,

          metadata: {},
        }));

      if (chunkRows.length > 0) {
        await tx
          .insert(
            documentChunks
          )
          .values(chunkRows);
      }

      return {
        documentId:
          document.id,

        sectionCount:
          sections.length,

        chunkCount:
          chunks.length,
      };
    }
  );
}
*/