import { db } from "../../../dbchatbot";

import { assets } from "../../schemas";

import {
  eq,
} from "drizzle-orm";

export async function getAssetById(
  assetId: string
) {
  return db.query.assets.findFirst({
    where: eq(
      assets.id,
      assetId
    ),
  });
}