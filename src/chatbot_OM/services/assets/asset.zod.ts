import { z } from "zod";

export const AssetTypeSchema =
  z.enum([
    "process",
    "equipment",
    "chemical",
    "instrument",
    "safety",
    "maintenance",
  ]);

export const CreateAssetSchema =
  z.object({
    assetType:
      AssetTypeSchema,

    code: z
      .string()
      .max(100)
      .optional(),

    name: z
      .string()
      .min(1)
      .max(500),

    description: z
      .string()
      .optional(),

    metadata: z
      .record(
        z.string(),
        z.unknown()
      )
      .optional(),
  });

export const UpdateAssetSchema =
  CreateAssetSchema.partial();

export type CreateAsset =
  z.infer<
    typeof CreateAssetSchema
  >;

export type UpdateAsset =
  z.infer<
    typeof UpdateAssetSchema
  >;