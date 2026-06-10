
// Import libs
import { z } from "zod";

// 1. assets zod
/*
export const AssetSchema = z.object({
  assetType: z.enum([
    "process",
    "equipment",
    "chemical",
    "instrument",
    "safety",
    "maintenance",
  ]),

  code: z.string().max(100).optional(),

  name: z.string().min(1).max(500),

  description: z.string().optional(),

  metadata: z.record(
    z.string(),
    z.unknown()
  ).default({}),
});
*/

//import { z } from "zod";

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


// 2. document
export const DocumentSchema = z.object({
  assetId: z.string().uuid(),

  documentType: z.string().max(50),

  title: z.string().min(1).max(500),

  version: z.string().max(50).optional(),

  rawMarkdown: z.string(),

  contentHash: z.string().length(64),

  metadata: z.record(
    z.string(),
    z.unknown()
  ).default({}),
});

// 3. document sections
export const DocumentSectionSchema =
  z.object({
    documentId: z.string().uuid(),

    parentId: z.string()
      .uuid()
      .nullable()
      .optional(),

    level: z.number()
      .int()
      .min(1),

    title: z.string()
      .min(1)
      .max(500),

    sectionType: z.string()
      .max(50)
      .nullable()
      .optional(),

    sectionPath: z.string(),

    pathSlug: z.string(),

    content: z.string(),

    sortOrder: z.number()
      .int()
      .min(0),

    metadata: z.record(
      z.string(),
      z.unknown()
    ).default({}),
  });

// 4. document chunks
export const DocumentChunkSchema =
  z.object({
    documentId: z.string().uuid(),

    sectionId: z.string().uuid(),

    sectionPath: z.string(),

    chunkIndex: z.number()
      .int()
      .min(0),

    content: z.string(),

    metadata: z.record(
      z.string(),
      z.unknown()
    ).default({}),
  });















