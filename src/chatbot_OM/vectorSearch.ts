import { embed } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "../dbchatbot";

import { sql } from "drizzle-orm";

export interface VectorSearchInput {
  query: string;

  assetId?: string;

  documentType?: string;

  limit?: number;
}

export interface VectorSearchResult {
  chunkId: string;

  documentId: string;

  sectionId: string;

  assetId: string;

  title: string;

  documentType: string;

  sectionPath: string;

  content: string;

  distance: number;
}

export async function vectorSearch(
  input: VectorSearchInput
): Promise<VectorSearchResult[]> {
  //----------------------------------
  // Query embedding
  //----------------------------------

  const { embedding } =
    await embed({
      model:
        google.embedding(
          "gemini-embedding-001"
        ),

      value:
        input.query,
    });

  //----------------------------------
  // Vector literal
  //----------------------------------

  const vector =
    `[${embedding.join(",")}]`;

  //----------------------------------
  // Dynamic filter
  //----------------------------------

  const filters = [];

  if (input.assetId) {
    filters.push(
      sql`d.asset_id = ${input.assetId}`
    );
  }

  if (
    input.documentType
  ) {
    filters.push(
      sql`d.document_type = ${input.documentType}`
    );
  }

  const whereClause =
    filters.length > 0
      ? sql`WHERE ${sql.join(
          filters,
          sql` AND `
        )}`
      : sql``;

  //----------------------------------
  // Search
  //----------------------------------

  const result =
    await db.execute(sql`
      SELECT
        c.id AS chunk_id,

        c.document_id,

        c.section_id,

        d.asset_id,

        d.title,

        d.document_type,

        c.section_path,

        c.content,

        (
          c.embedding <=> ${vector}::vector
        ) AS distance

      FROM document_chunks c

      INNER JOIN documents d
        ON d.id = c.document_id

      ${whereClause}

      ORDER BY
        c.embedding <=> ${vector}::vector

      LIMIT ${
        input.limit ?? 5
      }
    `);

  //----------------------------------
  // Mapping
  //----------------------------------

  return result.rows.map(
    (row: any) => ({
      chunkId:
        row.chunk_id,

      documentId:
        row.document_id,

      sectionId:
        row.section_id,

      assetId:
        row.asset_id,

      title:
        row.title,

      documentType:
        row.document_type,

      sectionPath:
        row.section_path,

      content:
        row.content,

      distance:
        Number(
          row.distance
        ),
    })
  );
}