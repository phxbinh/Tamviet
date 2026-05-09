// app/api/productchatbot/bot-sell/route.ts

import { db } from "@/productchatbot";

import {
  productDocuments,
} from "@/productchatbot/schema";

import {
  products,
} from "@/productchatbot/productsSchema";

import {
  streamText,
  embed,
  generateText,
  tool,
} from "ai";

import { google } from "@ai-sdk/google";

import {
  asc,
  cosineDistance,
  inArray,
  and,
  sql,
  eq,
  ne,
  not,
} from "drizzle-orm";

import { z } from "zod";

import {
  getCrossSellProducts_,
} from "../bot-sell/getCrossSellProducts";

export const maxDuration = 30;

// ======================================================
// MAIN
// ======================================================

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const lastMessage =
      messages[messages.length - 1]
        ?.content as string;

    // ======================================================
    // VALIDATE
    // ======================================================

    if (
      !lastMessage ||
      lastMessage.trim().length < 3
    ) {
      return new Response(
        "Câu hỏi quá ngắn.",
        {
          status: 400,
        }
      );
    }

    // ======================================================
    // SHORT HISTORY
    // ======================================================

    const recentMessages =
      messages.slice(-4);

    // ======================================================
    // INTENT CLASSIFIER
    // ======================================================

    const { text: rawIntent } =
      await generateText({
        model: google(
          "gemini-2.5-flash"
        ),

        system: `
Classify ecommerce intent.

Chỉ trả đúng 1 giá trị:

- CATEGORY_SEARCH
- PRODUCT_DETAIL
- CONSULTATION
- GREETING
- OTHER
`,
        prompt: lastMessage,
      });

    const intent =
      rawIntent.trim();

    // ======================================================
    // GREETING / OTHER CHAT
    // ======================================================

    if (
      intent === "GREETING" ||
      intent === "OTHER"
    ) {
      const casual =
        await streamText({
          model: google(
            "gemini-2.5-flash"
          ),

          system: `
Bạn là chatbot bán hàng thân thiện.

QUY TẮC:
- Trả lời ngắn gọn
- Tự nhiên
- Không bịa dữ liệu
`,

          messages: recentMessages,
        });

      return casual.toDataStreamResponse();
    }

    // ======================================================
    // SEARCH PHASE
    // ======================================================

    const aiSearch =
      await generateText({
        model: google(
          "gemini-2.5-flash"
        ),

        system: `
Bạn là AI tìm sản phẩm.

QUY TẮC:
- Khi user muốn tìm sản phẩm → gọi searchProducts
- Không bịa dữ liệu
- Không tự tạo sản phẩm
- Không tự tạo slug
`,

        messages: recentMessages,

        tools: {
          searchProducts: tool({
            description:
              "Tìm sản phẩm phù hợp với nhu cầu user",

            parameters:
              z.object({
                query:
                  z.string(),

                category:
                  z.string().optional(),

                minPrice:
                  z.number().optional(),

                maxPrice:
                  z.number().optional(),
              }),

            execute: async ({
              query,
              category,
              minPrice,
              maxPrice,
            }) => {

              const results =
                await searchProductSlugs({
                  semanticQuery:
                    query,

                  category,

                  minPrice,

                  maxPrice,
                });

              return {
                products:
                  results.map((p) => ({
                    slug:
                      p.slug,

                    title:
                      p.title,
                  })),
              };
            },
          }),
        },

        toolChoice: "required",

        maxSteps: 1,
      });

    // ======================================================
    // EXTRACT SEARCH RESULT
    // ======================================================

    const toolResults =
      aiSearch.toolResults || [];

    const searchTool =
      toolResults.find(
        (t: any) =>
          t.toolName ===
          "searchProducts"
      );

    const foundProducts =
      searchTool?.result
        ?.products || [];

    // ======================================================
    // NO PRODUCT FOUND
    // ======================================================

    if (!foundProducts.length) {
      const notFound =
        await streamText({
          model: google(
            "gemini-2.5-flash"
          ),

          system: `
Không tìm thấy sản phẩm phù hợp.

Hãy:
- xin lỗi user
- gợi ý user mô tả rõ hơn
- trả lời ngắn gọn
`,

          messages: recentMessages,
        });

      return notFound.toDataStreamResponse();
    }

    // ======================================================
    // FETCH MAIN PRODUCTS
    // ======================================================

    const slugs =
      foundProducts.map(
        (p: any) => p.slug
      );

    const mainProducts =
      await db
        .select({
          id: products.id,

          title: products.name,

          slug: products.slug,

          image:
            products.thumbnail_url,

          description:
            products.short_description,
        })
        .from(products)
        .where(
          inArray(
            products.slug,
            slugs
          )
        );

    // ======================================================
    // ORCHESTRATION
    // ======================================================

    let relatedProducts:
      any[] = [];

    let crossSellProducts:
      any[] = [];

    // ======================================================
    // CATEGORY SEARCH
    // ======================================================

    if (
      intent ===
      "CATEGORY_SEARCH"
    ) {

      relatedProducts =
        await getRelatedProducts(
          slugs
        );
    }

    // ======================================================
    // PRODUCT DETAIL
    // ======================================================

    if (
      intent ===
      "PRODUCT_DETAIL"
    ) {

      const firstProduct =
        mainProducts[0];

      const [
        related,
        crossSell,
      ] = await Promise.all([
        getRelatedProducts(
          slugs
        ),

        firstProduct?.id
          ? getCrossSellProducts_(
              firstProduct.id
            )
          : Promise.resolve([]),
      ]);

      relatedProducts =
        related;

      crossSellProducts =
        crossSell;
    }

    // ======================================================
    // LIGHTWEIGHT CONTEXT
    // ======================================================

    const lightweightContext = {
      intent,

      mainProducts:
        mainProducts.map((p) => ({
          title: p.title,

          slug: p.slug,
        })),

      relatedProducts:
        relatedProducts.map(
          (p) => ({
            title: p.name,

            slug: p.slug,
          })
        ),

      crossSellProducts:
        crossSellProducts.map(
          (p) => ({
            title: p.name,

            slug: p.slug,
          })
        ),
    };

    // ======================================================
    // FINAL RESPONSE
    // ======================================================

    const finalResponse =
      await streamText({
        model: google(
          "gemini-2.5-flash"
        ),

        system: `
Bạn là Tâm Việt AI.

Mục tiêu:
- Tư vấn sản phẩm ngắn gọn
- Thân thiện
- Tự nhiên

QUY TẮC:
- Không bịa dữ liệu
- Chỉ dùng sản phẩm trong context
- Không nhắc đến tool
- Không tự tạo sản phẩm
`,

        messages: [
          ...recentMessages,

          {
            role: "system",

            content: `
AVAILABLE DATA:

${JSON.stringify(
  lightweightContext
)}
`,
          },
        ],
      });

    // ======================================================
    // API RESPONSE
    // ======================================================

    return Response.json({
      text:
        await finalResponse.text,

      intent,

      products:
        mainProducts.map((p) => ({
          ...p,

          image:
            p.image ||
            "/placeholder.jpg",

          price: "Liên hệ",

          url:
            `/testSearchParam/products/${p.slug}`,
        })),

      relatedProducts:
        relatedProducts.map(
          (p) => ({
            title: p.name,

            slug: p.slug,

            image:
              p.thumbnail_url ||
              "/placeholder.jpg",

            price: "Liên hệ",

            url:
              `/testSearchParam/products/${p.slug}`,
          })
        ),

      crossSellProducts:
        crossSellProducts.map(
          (p) => ({
            title: p.name,

            slug: p.slug,

            image:
              p.thumbnail_url ||
              "/placeholder.jpg",

            price: "Liên hệ",

            url:
              `/testSearchParam/products/${p.slug}`,
          })
        ),
    });

  } catch (error) {
    console.error(
      "❌ BOT ERROR:",
      error
    );

    return new Response(
      "Internal Server Error",
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// SEARCH PRODUCTS
// ======================================================

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

  const { embedding } =
    await embed({
      model:
        google.embedding(
          "gemini-embedding-001"
        ),

      value:
        semanticQuery || "",
    });

  const distance =
    cosineDistance(
      productDocuments.embedding,
      embedding
    );

  const conditions = [];

  if (maxPrice) {
    conditions.push(
      sql`(metadata->>'maxPrice')::int <= ${maxPrice}`
    );
  }

  if (minPrice) {
    conditions.push(
      sql`(metadata->>'minPrice')::int >= ${minPrice}`
    );
  }

  if (category) {
    conditions.push(
      sql`metadata->'categories' ? ${category}`
    );
  }

  const rows = await db
    .select({
      title:
        productDocuments.title,

      slug:
        productDocuments.slug,

      metadata:
        productDocuments.metadata,
    })
    .from(productDocuments)
    .where(
      conditions.length
        ? and(...conditions)
        : undefined
    )
    .orderBy(asc(distance))
    .limit(8);

  return rows;
}

// ======================================================
// RELATED PRODUCTS
// ======================================================

async function getRelatedProducts(
  slugs: string[]
) {

  const base = await db
    .select({
      product_type:
        products.product_type,
    })
    .from(products)
    .where(
      inArray(
        products.slug,
        slugs
      )
    );

  const productTypes = [
    ...new Set(
      base
        .map(
          (p) =>
            p.product_type
        )
        .filter(
          (
            v
          ): v is string =>
            v !== null &&
            v !== "default"
        )
    ),
  ];

  if (!productTypes.length)
    return [];

  const related = await db
    .select({
      name: products.name,

      slug: products.slug,

      thumbnail_url:
        products.thumbnail_url,
    })
    .from(products)
    .where(
      and(
        inArray(
          products.product_type,
          productTypes
        ),

        not(
          inArray(
            products.slug,
            slugs
          )
        ),

        ne(
          products.product_type,
          "default"
        )
      )
    )
    .limit(6);

  return related;
}