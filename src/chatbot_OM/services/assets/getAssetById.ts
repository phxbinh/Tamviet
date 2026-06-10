import { db } from "../../../dbchatbot";

import { assets } from "../../schemas";

import {
  eq,
} from "drizzle-orm";

export async function getAssetById(
  assetId: string
) {
  const result = await db
    .select()
    .from(assets)
    .where(eq(assets.id, assetId))
    .limit(1);

  return result[0] ?? null;
}