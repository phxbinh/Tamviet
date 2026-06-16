import { z } from "zod";

export const MetadataSchema =
  z.object({
    sectionType: z.enum([
      "purpose",
      "principle",
      "startup",
      "operation",
      "shutdown",
      "maintenance",
      "safety",
      "troubleshooting",
      "parameter",
      "other",
    ]),

    summary:
      z.string()
        .nullable(),

    keywords:
      z.array(z.string())
        .max(15),

    intentTags:
      z.array(z.string())
        .max(10),
  });

export type SectionMetadata =
  z.infer<
    typeof MetadataSchema
  >;