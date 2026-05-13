// openRoute/openProductDetail.ts

import { tool } from "ai";
import { z } from "zod";

export const openProductDetail = tool({
  description: `
Mở modal chi tiết sản phẩm.

Dùng khi user muốn:
- xem chi tiết sản phẩm
- mở sản phẩm cụ thể
- xem thông tin sản phẩm
`,

  parameters: z.object({
    slug: z.string(),

    title: z.string().optional(),
  }),

  execute: async ({
    slug,
    title,
  }) => {

    return {
      type: "open_product_detail",

      slug,

      title,
    };
  },
});