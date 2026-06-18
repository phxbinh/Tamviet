import { sql } from "drizzle-orm";
import { db } from "../../dbchatbot";

export interface FoundDocument {
  id: string;
  title: string;
  documentType: string;
  score: number;
}

export async function findDocument(
  searchText: string
): Promise<FoundDocument | null> {
  const normalized =
    searchText.trim();

/*
  const result =
    await db.execute(sql`
      SELECT
        id,
        title,
        document_type,
        similarity(
          title,
          ${normalized}
        ) AS score
      FROM documents
      WHERE similarity(
        title,
        ${normalized}
      ) > 0.4
      ORDER BY score DESC
      LIMIT 1
    `);
*/
const result =
  await db.execute(sql`
    SELECT
      id,
      title,
      document_type,
      GREATEST(
        similarity(title, ${normalized}),
        CASE
          WHEN title ILIKE ${"%" + normalized + "%"}
          THEN 1
          ELSE 0
        END
      ) AS score
    FROM documents
    WHERE
      title ILIKE ${"%" + normalized + "%"}
      OR similarity(title, ${normalized}) > 0.2
    ORDER BY score DESC
    LIMIT 1
  `);





  if (
    !result.rows ||
    result.rows.length === 0
  ) {
    return null;
  }

  const row =
    result.rows[0];

  return {
    id: row.id as string,
    title: row.title as string,
    documentType:
      row.document_type as string,
    score: Number(row.score),
  };
}