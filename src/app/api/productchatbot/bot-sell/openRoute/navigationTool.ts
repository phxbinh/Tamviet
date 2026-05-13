// openRoute/navigationTool.ts

import { tool } from "ai";
import { z } from "zod";

export const openCategoryPage = tool({
  description: `
Mở trang category sản phẩm.

Ví dụ:
- "mở đồ thể thao"
- "xem sản phẩm cầu lông"
- "cho tôi xem sports"

Tool này dùng để điều hướng tới trang category.
`,
  
  parameters: z.object({
    categoryName: z.string(),
    page: z.number().optional().default(1),
  }),

  execute: async ({ categoryName, page }) => {
    return {
      success: true,
      categoryName,
      page,
    };
  },
});