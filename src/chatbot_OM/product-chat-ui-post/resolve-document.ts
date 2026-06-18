import { tool } from "ai";
import { z } from "zod";

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
    inputSchema: z.object({
      searchText: z.string(),
    }),

    execute: async ({
      searchText,
    }) => {
      return {
        searchText,
      };
    },
  });