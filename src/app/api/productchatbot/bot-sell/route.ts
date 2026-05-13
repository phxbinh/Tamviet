// app/api/productchatbot/bot-sell/route.ts
// =================== NGẮT ===============
// app/api/productchatbot/bot-sell/route.ts

import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { products } from "@/productchatbot/productsSchema";

import { streamText, embed, generateText, tool, generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { asc, cosineDistance, inArray, and, sql } from "drizzle-orm";
import { not, ne } from "drizzle-orm";
import { z } from "zod";

import { getCrossSellProducts,
         getCrossSellProducts_,
         getCrossSellProductsOptimized } from "./getCrossSellProducts";

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

    const recentMessages = messages.slice(-6);

    // ================= 1. INTENT + FILTER EXTRACTION =================

    const parsedResult = await generateObject({
      model: google("gemini-2.5-flash"),

      schema: z.object({
        intent: z.enum([
          "PRODUCT",
          "GREETING",
          "OTHER",
        ]),

        semanticQuery: z.string().nullable(),

        category: z.string().nullable(),

        minPrice: z.number().nullable(),

        maxPrice: z.number().nullable(),
      }),

      system: `
Phân tích câu người dùng.

Rules:

- Nếu user muốn tìm/mua/xem/gợi ý sản phẩm:
  intent = PRODUCT

- Nếu user chào hỏi xã giao:
  intent = GREETING

- Còn lại:
  intent = OTHER

- semanticQuery phải là từ khóa sạch.
Ví dụ:
"Tôi muốn tìm nước uống ngon"
→ "nước uống"

- Nếu không có giá trị thì trả null.

- Chỉ trả dữ liệu đúng schema.
`,

      prompt: lastMessage,
    });

    const parsed = parsedResult.object;

    // ================= 2. NON PRODUCT CHAT =================

    if (parsed.intent !== "PRODUCT") {
      const result = await streamText({
        model: google("gemini-2.5-flash"),

        system: `
Bạn là chatbot bán hàng thân thiện.

- Trả lời ngắn gọn
- Tự nhiên
- Có thể gợi ý khách tìm sản phẩm
- Không lan man
`,

        messages: recentMessages,
      });

      return result.toDataStreamResponse();
    }

    // ================= 3. SEARCH =================

    let vectorResults = await searchProductSlugs({
      semanticQuery:
        parsed.semanticQuery || lastMessage,

      category:
        parsed.category || undefined,

      maxPrice:
        parsed.maxPrice || undefined,

      minPrice:
        parsed.minPrice || undefined,
    });

    // ================= 4. FALLBACK =================

    if (
      !vectorResults.length &&
      (parsed.category ||
        parsed.maxPrice ||
        parsed.minPrice)
    ) {
      vectorResults =
        await searchProductSlugs({
          // ❌ KHÔNG dùng query rỗng nữa
          semanticQuery:
            parsed.category ||
            parsed.semanticQuery ||
            "sản phẩm",

          category:
            parsed.category || undefined,

          maxPrice:
            parsed.maxPrice || undefined,

          minPrice:
            parsed.minPrice || undefined,
        });
    }

    // ================= 5. NO RESULTS =================

    if (!vectorResults.length) {
      const result = await streamText({
        model: google("gemini-2.5-flash"),

        system: `
Không tìm thấy sản phẩm phù hợp.

- Xin lỗi ngắn gọn
- Hỏi lại nhu cầu user
- Gợi ý user thử mô tả khác
`,

        messages: [
          {
            role: "user",
            content: lastMessage,
          },
        ],
      });

      return result.toDataStreamResponse();
    }

    // ================= 6. BUILD CONTEXT =================

    const context = vectorResults
      .slice(0, 8)
      .map((p) => {
        const meta = p.metadata as any;

        return `
ID: ${p.slug}
Tên: ${p.title}
Giá: ${
          meta?.minPrice ?? "?"
        } - ${meta?.maxPrice ?? "?"}
Danh mục: ${
          meta?.categories?.join(", ") ??
          "?"
        }
`;
      })
      .join("\n");

    // ================= 7. FINAL RESPONSE =================

    const result = await streamText({
      model: google("gemini-2.5-flash"),

      maxSteps: 3,

/*
system:`
Bạn là nhân viên bán hàng thân thiện và hiểu sản phẩm.

DANH SÁCH SẢN PHẨM:
${context}

RULES:

- Nếu có sản phẩm phù hợp:
  1. PHẢI gọi tool showProductCards đúng 1 lần.
  2. Sau đó giải thích ngắn gọn vì sao phù hợp.

CÁCH NÓI:

- Nói tự nhiên như chat với khách.
- Thân thiện, mềm mại.
- Giống người tư vấn thật.
- Tránh văn phong AI hoặc tổng đài.
- Không lặp lại nguyên văn yêu cầu của khách.
- Không nói:
  "Sản phẩm này phù hợp với yêu cầu của bạn."

- Ưu tiên kiểu:
  "Bạn có thể tham khảo mẫu này nha 😊"
  "Dòng này khá hợp nếu bạn thích..."
  "Mẫu này đang được nhiều người chọn đó."

- Mỗi câu trả lời chỉ nên dài 1–3 câu ngắn.
`,
*/

system: `
Bạn là nhân viên bán hàng thân thiện và tư vấn tự nhiên như người thật.

DANH SÁCH SẢN PHẨM:
${context}

QUY TRÌNH:

- Nếu có sản phẩm phù hợp:
  1. Gọi tool showProductCards ngay lập tức và chỉ 1 lần.
  2. Không viết text trước tool call.
  3. Sau tool call:
     - viết 1-2 câu ngắn tự nhiên
     - giải thích nhẹ vì sao phù hợp
- Nếu user muốn mở/xem danh mục:
  gọi tool openCategoryPage
  Ví dụ:
    - "mở đồ thể thao"
    - "xem danh mục cầu lông"
    - "cho tôi xem sports"

CÁCH NÓI:

- Tự nhiên như chat với khách
- Không máy móc
- Không lặp ý
- Không dùng kiểu:
  "Sản phẩm này phù hợp với yêu cầu của bạn"

Ưu tiên kiểu:

- "Bạn có thể tham khảo mẫu này nha 😊"
- "Dòng này khá ổn nếu dùng hằng ngày đó."
`,

      messages: recentMessages,

      tools: {
        showProductCards: tool({
          description:
            "Hiển thị danh sách sản phẩm phù hợp cho user",

          parameters: z.object({
            slugs: z.array(z.string()),
          }),

          execute: async ({ slugs }) => {
            const data = await db
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
                inArray(products.slug, slugs)
              );

            if (!data.length) {
              return {
                products: [],
                related: [],
                crossSell: [],
              };
            }

            // ================= RELATED =================

            const related =
              await getRelatedProducts(slugs);

            // ================= CROSS SELL =================

            const baseProduct = data[0];

            const crossSell =
              await getCrossSellProducts_(
                baseProduct.id
              );

            return {
              products: data.map((p) => ({
                title: p.title,
                slug: p.slug,
                image:
                  p.image ||
                  "/placeholder.jpg",
                description:
                  p.description,
                price: "Liên hệ",
                url: `/testSearchParam/products/${p.slug}`,
              })),

              related: related.map((p) => ({
                title: p.name,
                slug: p.slug,
                image:
                  p.thumbnail_url ||
                  "/placeholder.jpg",
                price: "Liên hệ",
                url: `/testSearchParam/products/${p.slug}`,
              })),

              crossSell: crossSell.map(
                (p) => ({
                  title: p.name,
                  slug: p.slug,
                  image:
                    p.thumbnail_url ||
                    "/placeholder.jpg",
                  price: "Liên hệ",
                  url: `/testSearchParam/products/${p.slug}`,
                })
              ),
            };
          },
        }),

openCategoryPage: tool({
  description:
    "Mở trang category/filter sản phẩm",

  parameters: z.object({
    category: z.string(),

    page: z.number().optional(),
  }),

  execute: async ({
    category,
    page = 1,
  }) => {
    return {
      type: "category_navigation",

      category,

      page,

      ctaLabel: `Xem ${category}`,
    };
  },
}),




      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("❌ ERROR:", error);

    return new Response(
      "Error occurred",
      {
        status: 500,
      }
    );
  }
}

// ================= SEARCH FUNCTION =================
/* Chạy được */
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

/* Lỗi khi lọc theo giá 
// Kiểm tra cách cài đặt điều kiện tìm kiếm where
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
  // ===============================
  // 1. CLEAN QUERY
  // ===============================
  const query = semanticQuery?.trim();

  // ===============================
  // 2. BUILD FILTER CONDITIONS
  // ===============================
  const conditions = [];

  if (maxPrice !== undefined && maxPrice !== null) {
    conditions.push(
      sql`(metadata->>'maxPrice')::int <= ${maxPrice}`
    );
  }

  if (minPrice !== undefined && minPrice !== null) {
    conditions.push(
      sql`(metadata->>'minPrice')::int >= ${minPrice}`
    );
  }

  if (category) {
    conditions.push(
      sql`metadata->'categories' ? ${category}`
    );
  }

  // ===============================
  // 3. NO SEMANTIC QUERY
  // → ONLY FILTER SEARCH
  // ===============================
  if (!query) {
    const rows = await db
      .select({
        title: productDocuments.title,
        slug: productDocuments.slug,
        metadata: productDocuments.metadata,
      })
      .from(productDocuments)
      .where(
        conditions.length
          ? and(...conditions)
          : undefined
      )
      .limit(8);

    return rows;
  }

  // ===============================
  // 4. EMBEDDING SEARCH
  // ===============================
  const { embedding } = await embed({
    model: google.embedding(
      "gemini-embedding-001"
    ),
    value: query,
  });

  const distance = cosineDistance(
    productDocuments.embedding,
    embedding
  );

  // ===============================
  // 5. HYBRID SEARCH
  // ===============================
  const rows = await db
    .select({
      title: productDocuments.title,
      slug: productDocuments.slug,
      metadata: productDocuments.metadata,
      similarity: distance,
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
*/




// ================== Cuối NGẮT ===========


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


