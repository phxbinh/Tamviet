// openRoute/navigationTool.ts

/*
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
*/

// openRoute/navigationTool.ts

import { tool } from "ai";
import { z } from "zod";

export const openCategoryPage = tool({
  description: `
Dùng khi user muốn:
- mở category
- xem danh mục
- đi tới trang sản phẩm
- xem sản phẩm theo loại

Ví dụ:
- "mở đồ thể thao"
- "xem cầu lông"
- "show me badminton"
- "cho tôi xem sports"

Chỉ dùng cho điều hướng category.
`,

  parameters: z.object({
    category: z.string().describe(`
Tên category user muốn xem.
Có thể là:
- tiếng Việt
- tiếng Anh
- synonym

Ví dụ:
- "sports"
- "thể thao"
- "badminton"
- "cầu lông"
`),

    page: z.number().optional().default(1),

    message: z.string().optional().describe(`
Câu CTA ngắn hiển thị cho user.
Ví dụ:
- "Xem sản phẩm"
- "Mở danh mục"
- "Xem đồ thể thao"
`),
  }),

  execute: async ({
    category,
    page,
    message,
  }) => {

    return {
      type: "category_navigation",

      category,

      page,

      ctaLabel:
        message ||
        `Xem ${category}`,
    };
  },
});





