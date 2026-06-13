/*
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
*/



import { db } from "../../dbchatbot";

import { sql } from "drizzle-orm";

export interface AssetMatch {
  id: string;
  name: string;
  score: number;
}

export async function findAsset(
  assetName: string
): Promise<AssetMatch | null> {

  const result =
    await db.execute(sql`
      SELECT
        id,
        name,

        similarity(
          lower(name),
          lower(${assetName})
        ) AS score

      FROM assets

      ORDER BY score DESC

      LIMIT 1
    `);

  if (
    !result.rows.length
  ) {
    return null;
  }

  const row =
    result.rows[0];

  const score =
    Number(
      row.score
    );

  // tránh match bậy
  if (
    score < 0.25
  ) {
    return null;
  }

  return {
    id:
      row.id as string,

    name:
      row.name as string,

    score,
  };
}







