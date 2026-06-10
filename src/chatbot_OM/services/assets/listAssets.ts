import { db } from "./db";

import { assets } from "../../schema";

import {
  asc,
  eq,
} from "drizzle-orm";

export async function listAssets(
  assetType?: string
) {
  if (assetType) {
    return db.query.assets.findMany({
      where: eq(
        assets.assetType,
        assetType
      ),

      orderBy: [
        asc(
          assets.name
        ),
      ],
    });
  }

  return db.query.assets.findMany({
    orderBy: [
      asc(
        assets.assetType
      ),
      asc(
        assets.name
      ),
    ],
  });
}