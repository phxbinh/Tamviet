import { db } from "../../../dbchatbot";

import { assets } from "../../schemas";

import {
  eq,
} from "drizzle-orm";

import {
  UpdateAssetSchema,
} from "./asset.zod";

import type {
  UpdateAssetInput,
} from "./asset.types";

export async function updateAsset(
  assetId: string,
  input: UpdateAssetInput
) {
  const data =
    UpdateAssetSchema.parse(
      input
    );

  const [asset] =
    await db
      .update(assets)
      .set({
        ...data,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          assets.id,
          assetId
        )
      )
      .returning();

  if (!asset) {
    throw new Error(
      "Asset not found"
    );
  }

  return asset;
}