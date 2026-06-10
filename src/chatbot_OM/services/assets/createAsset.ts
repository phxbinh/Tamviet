import { db } from "../../../dbchatbot";

import { assets } from "../../schemas";

import { eq } from "drizzle-orm";

import {
  CreateAssetSchema,
} from "./asset.zod";

import type {
  CreateAssetInput,
} from "./asset.types";

export async function createAsset(
  input: CreateAssetInput
) {
  const data =
    CreateAssetSchema.parse(
      input
    );

  //----------------------------------
  // check code
  //----------------------------------

  if (data.code) {
    const existing = await db
      .select()
      .from(assets)
      .where(eq(assets.code, data.code))
      .limit(1);
    
    if (existing.length > 0) {
      throw new Error(
        `Asset code already exists: ${data.code}`
      );
    }
  }

  //----------------------------------
  // insert
  //----------------------------------

  const [asset] =
    await db
      .insert(assets)
      .values({
        assetType:
          data.assetType,

        code:
          data.code,

        name:
          data.name,

        description:
          data.description,

        metadata:
          data.metadata ?? {},
      })
      .returning();

  return asset;
}