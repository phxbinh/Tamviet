/*
import { tool } from "ai";
import { z } from "zod";

export const resolveDocumentSchema =
  z.object({
    searchText: z
      .string()
      .trim()
      .min(1),
});

export type ResolveDocumentResult =
  z.infer<
    typeof resolveDocumentSchema
  >;

export const resolveDocumentTool =
  tool({
    description: `
Use this tool when the user wants:

- open a document
- view a document
- SOP
- operation manual
- maintenance manual
- work instruction
- operating procedure

Extract only the document
or asset name.

Examples:

"Cho tôi SOP thay màng UF"
=> searchText = "thay màng UF"

"Mở hướng dẫn vận hành máy ép bùn"
=> searchText = "máy ép bùn"

"Xem tài liệu bể sinh học hiếu khí"
=> searchText = "bể sinh học hiếu khí"
`,

    parameters:
      resolveDocumentSchema,

    execute: async (
      input
    ): Promise<ResolveDocumentResult> => {
      return
        resolveDocumentSchema.parse(
          input
        );
    },
  });
*/


import { tool } from "ai";
import { z } from "zod";

export const resolveDocumentSchema =
  z.object({
    searchText: z
      .string()
      .trim()
      .min(1),
  });

export type ResolveDocumentResult =
  z.infer<
    typeof resolveDocumentSchema
  >;

export const resolveDocumentTool =
  tool({
    description: `
Use this tool when the user wants:

- open a document
- view a document
- SOP
- operation manual
- maintenance manual
- work instruction
- operating procedure

Extract only the document
or asset name.
`,

    parameters:
      resolveDocumentSchema,

    execute: async (
      input
    ): Promise<ResolveDocumentResult> => {
      return resolveDocumentSchema.parse(
        input
      );
    },
  });

/*
import { tool } from "ai";
import { z } from "zod";

export const resolveDocumentSchema = z.object({
  searchText: z.string().trim().min(1, "Search text is required"),
});

export type ResolveDocumentResult = z.infer<typeof resolveDocumentSchema>;

export const resolveDocumentTool = tool({
  description: `
Use this tool when the user wants to open, view, or find:
- SOP, Operation Manual, Maintenance Manual, Work Instruction...

Extract the main document name or keyword clearly.
`,

  parameters: resolveDocumentSchema,

  execute: async (input): Promise<ResolveDocumentResult> => {
    // Chỉ parse, không làm gì thêm
    return resolveDocumentSchema.parse(input);
  },
});
*/
