import { embed } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "../../dbchatbot";

import { sql } from "drizzle-orm";

export async function findAsset(
  assetName: string
) {
  const { embedding } =
    await embed({
      model:
        google.embedding(
          "gemini-embedding-001"
        ),

      value:
        assetName,
    });

  const vector =
    `[${embedding.join(",")}]`;

  const result =
    await db.execute(sql`
      SELECT
        id,
        name,
        embedding <=> ${vector}::vector
          AS distance

      FROM assets

      ORDER BY
        embedding <=> ${vector}::vector

      LIMIT 1
    `);

  if (
    !result.rows.length
  ) {
    return null;
  }

  const row =
    result.rows[0];

  if (
    Number(
      row.distance
    ) > 0.35
  ) {
    return null;
  }

  return {
    id:
      row.id as string,

    name:
      row.name as string,
  };
}