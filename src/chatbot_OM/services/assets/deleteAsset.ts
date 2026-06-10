import { db } from "./db";

import { assets } from "../../schemas";

import {
  eq,
} from "drizzle-orm";

export async function deleteAsset(
  assetId: string
) {
  const [asset] =
    await db
      .delete(assets)
      .where(
        eq(
          assets.id,
          assetId
        )
      )
      .returning();

  return asset;
}