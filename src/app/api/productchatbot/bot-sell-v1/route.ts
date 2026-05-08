/// ========
import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { products } from "@/productchatbot/productsSchema";

import { streamText, embed, generateText, tool } from "ai";
import { google } from "@ai-sdk/google";

import { asc, cosineDistance, inArray, and, sql } from "drizzle-orm";
import { not, ne } from "drizzle-orm";
import { z } from "zod";

import { getCrossSellProducts,
         getCrossSellProducts_,
         getCrossSellProductsOptimized } from "../bot-sell/getCrossSellProducts";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const lastMessage =
      messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 3) {
      return new Response("Câu hỏi quá ngắn.", {
        status: 400,
      });
    }

    // Giữ history ngắn để tiết kiệm token
    const recentMessages = messages.slice(-4);

    // =========================
    // 1. ROUTER
    // =========================

    const { text: intent } = await generateText({
      model: google("gemini-2.5-flash"),

      system: `
Classify user intent.

Chỉ trả đúng 1 từ:
- PRODUCT
- GREETING
- OTHER
`,

      prompt: lastMessage,
    });

    // =========================
    // 2. NON PRODUCT CHAT
    // =========================

    if (intent !== "PRODUCT") {
      const result = await streamText({
        model: google("gemini-2.5-flash"),

        system: `
Bạn là chatbot bán hàng thân thiện.

- Trả lời ngắn gọn
- Tự nhiên
- Không bịa dữ liệu
`,

        messages: recentMessages,
      });

      return result.toDataStreamResponse();
    }

    // =========================
    // 3. AGENT MODE
    // =========================

    const result = await streamText({
      model: google("gemini-2.5-flash"),

      maxSteps: 3,

      system: `
Bạn là trợ lý bán hàng AI.

QUY TẮC:

- Khi user muốn tìm sản phẩm → dùng searchProducts
- Sau khi tìm thấy sản phẩm phù hợp → dùng showProductCards
- Nếu user muốn thêm lựa chọn tương tự → dùng showRelatedProducts
- Nếu phù hợp với ngữ cảnh mua hàng → có thể dùng showCrossSellProducts
- Không spam cross sell
- Không bịa dữ liệu
- Không tự tạo slug hoặc sản phẩm không tồn tại
`,

      messages: recentMessages,

      tools: {
        // =========================
        // SEARCH PRODUCTS
        // =========================

        searchProducts: tool({
          description:
            "Tìm sản phẩm phù hợp với nhu cầu user",

          parameters: z.object({
            query: z.string(),

            category: z.string().optional(),

            minPrice: z.number().optional(),

            maxPrice: z.number().optional(),
          }),

          execute: async ({
            query,
            category,
            minPrice,
            maxPrice,
          }) => {

            const results =
              await searchProductSlugs({
                semanticQuery: query,
                category,
                minPrice,
                maxPrice,
              });

            return {
              products: results.map((p) => ({
                slug: p.slug,
                title: p.title,
              })),
            };
          },
        }),

        // =========================
        // SHOW PRODUCT CARDS
        // =========================

        showProductCards: tool({
          description:
            "Hiển thị sản phẩm cho user",

          parameters: z.object({
            slugs: z.array(z.string()),
          }),

          execute: async ({ slugs }) => {

            const data = await db
              .select({
                id: products.id,
                title: products.name,
                slug: products.slug,
                image: products.thumbnail_url,
                description:
                  products.short_description,
              })
              .from(products)
              .where(
                inArray(products.slug, slugs)
              );

            return {
              products: data.map((p) => ({
                ...p,
                image:
                  p.image || "/placeholder.jpg",

                price: "Liên hệ",

                url: `/testSearchParam/products/${p.slug}`,
              })),
            };
          },
        }),

        // =========================
        // RELATED PRODUCTS
        // =========================

        showRelatedProducts: tool({
          description:
            "Hiển thị sản phẩm tương tự hoặc cùng loại",

          parameters: z.object({
            slugs: z.array(z.string()),
          }),

          execute: async ({ slugs }) => {

            const related =
              await getRelatedProducts(slugs);

            return {
              related: related.map((p) => ({
                title: p.name,
                slug: p.slug,

                image:
                  p.thumbnail_url ||
                  "/placeholder.jpg",

                price: "Liên hệ",

                url: `/testSearchParam/products/${p.slug}`,
              })),
            };
          },
        }),

        // =========================
        // CROSS SELL
        // =========================

        showCrossSellProducts: tool({
          description:
            "Hiển thị sản phẩm mua kèm phù hợp như phụ kiện hoặc đồ bổ trợ",

          parameters: z.object({
            slug: z.string(),
          }),

          execute: async ({ slug }) => {

            const baseProducts = await db
              .select({
                id: products.id,
              })
              .from(products)
              .where(eq(products.slug, slug))
              .limit(1);

            if (!baseProducts.length) {
              return {
                crossSell: [],
              };
            }

            const crossSell =
              await getCrossSellProducts_(
                baseProducts[0].id
              );

            return {
              crossSell: crossSell.map((p) => ({
                title: p.name,
                slug: p.slug,

                image:
                  p.thumbnail_url ||
                  "/placeholder.jpg",

                price: "Liên hệ",

                url: `/testSearchParam/products/${p.slug}`,
              })),
            };
          },
        }),
      },
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("❌ ERROR:", error);

    return new Response("Error occurred", {
      status: 500,
    });
  }
}


async function searchProductSlugs({
  semanticQuery,
  category,
  maxPrice,
  minPrice,
}: {
  semanticQuery?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
}) {
  const { embedding } = await embed({
    model: google.embedding("gemini-embedding-001"),
    value: semanticQuery || "",
  });

  const distance = cosineDistance(productDocuments.embedding, embedding);

  const conditions = [];

  if (maxPrice) {
    conditions.push(sql`(metadata->>'maxPrice')::int <= ${maxPrice}`);
  }

  if (minPrice) {
    conditions.push(sql`(metadata->>'minPrice')::int >= ${minPrice}`);
  }

  if (category) {
    conditions.push(sql`metadata->'categories' ? ${category}`);
  }


  const rows = await db
    .select({
      title: productDocuments.title,
      slug: productDocuments.slug,
      metadata: productDocuments.metadata,
    })
    .from(productDocuments)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(distance))
    .limit(8);
  return rows;
}



// Dùng chung ⛳️🟢
//import { and, inArray, not, ne } from "drizzle-orm";
async function getRelatedProducts(slugs: string[]) {

  const base = await db
    .select({
      product_type: products.product_type
    })
    .from(products)
    .where(inArray(products.slug, slugs));

  const productTypes = [
    ...new Set(
      base
        .map(p => p.product_type)
        .filter((v): v is string => v !== null && v !== "default")
    )
  ];

  if (!productTypes.length) return [];

  const related = await db
    .select({
      name: products.name,
      slug: products.slug,
      thumbnail_url: products.thumbnail_url
    })
    .from(products)
    .where(
      and(
        inArray(products.product_type, productTypes),
        not(inArray(products.slug, slugs)),
        ne(products.product_type, "default")
      )
    )
    .limit(6);

  return related;
}
