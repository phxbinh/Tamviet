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

import { openCategoryPage } from "./openRoute/navigationTool";

//src/app/api/productchatbot/bot-sell/openRoute/openProductDetail.ts
import { openProductDetail } from "./openRoute/openProductDetail";

import { getCategory } from "./getCategory";

export const maxDuration = 30;
export const runtime = 'edge'

// Sử dụng cho reranked tăng độ chính xác
const rerankWithGemini = async (
  query: string, 
  candidates: Array<{ id: string; title: string; description: string }>
) => {
  // Nếu danh sách rỗng thì trả về luôn để đỡ tốn tiền gọi API
  if (!candidates.length) return [];

  const result = await generateObject({
    model: google("models/gemini-2.5-flash"), // Đã sửa cú pháp model đúng chuẩn
    schema: z.object({
      ranked: z.array(z.object({
        id: z.string(),
        score: z.number().min(0).max(1), 
        reason: z.string().optional()
      })).max(15)
    }),
    temperature: 0,
    system: `Bạn là reranker chuyên nghiệp cho sản phẩm.
Xếp hạng các sản phẩm theo độ liên quan với query của người dùng.
Chỉ giữ lại những sản phẩm thực sự phù hợp với nhu cầu của khách hàng.
QUY TẮC BẮT BUỘC: Giữ nguyên chính xác 'id' đầu vào, không tự bịa ID mới.`,
    prompt: `
Query của khách: "${query}"
Danh sách sản phẩm cần xếp hạng:
${candidates.map((c, idx) => `
${idx + 1}. ID: ${c.id}
 Tên: ${c.title}
 Mô tả: ${c.description}`).join('\n')}
`,
  });

  // Trích xuất mảng đã được sắp xếp, ưu tiên điểm cao lên trước
  return result.object.ranked.sort((a, b) => b.score - a.score);
};




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
          "PRODUCT_DETAIL",
          "NAVIGATION",
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

- Nếu user muốn:
  - xem chi tiết sản phẩm
  - mở sản phẩm cụ thể
  - xem thông tin sản phẩm cụ thể
  → intent = PRODUCT_DETAIL
  Ví dụ:
    - "xem chi tiết Yonex Astrox 88D"
    - "mở sản phẩm coca cola"
    - "show detail of iphone 15"
    - "cho tôi xem sản phẩm này"

- Nếu user muốn mở/truy cập/xem một danh mục hoặc trang:
  intent = NAVIGATION
  Ví dụ:
  - "mở đồ thể thao"
  - "xem danh mục cầu lông"
  - "đi tới sports"
  - "mở trang thể thao"

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



// Chạy khi user tìm kiếm danh mục =========
if (parsed.intent === "NAVIGATION") {

  const result = await streamText({
    model: google("gemini-2.5-flash"),

    messages: recentMessages,

    tools: {
      openCategoryPage,
    },

    toolChoice: "required",

    maxSteps: 1,

  system: `
Bạn là nhân viên tư vấn bán hàng thân thiện và chuyên nghiệp. Trả lời tự nhiên, ngắn gọn, dễ hiểu.

Nếu user muốn mở/xem category thì bắt buộc phải gọi tool openCategoryPage.
Sau khi gọi tool KHÔNG được lặp lại tool result.
Sau khi gọi tool BẮT BUỘC:
- Trả lời ngắn gọn, tự nhiên như nhân viên tư vấn.
- Giới thiệu ngắn gọn category đã mở.
`,
  });

  return result.toDataStreamResponse();
}

// Chạy khi user yêu cầu xem chi tiết sản phẩm
if (parsed.intent === "PRODUCT_DETAIL") {

  // 1. SEARCH PRODUCT
/*
  const products =
    await searchProductSlugs({
      semanticQuery:
        parsed.semanticQuery || lastMessage,
    });
*/
const products = await searchProductSlugs({
      semanticQuery:
        parsed.semanticQuery || lastMessage,

      category:
        parsed.category || undefined,

      maxPrice:
        parsed.maxPrice || undefined,

      minPrice:
        parsed.minPrice || undefined,
    });


  // Không tìm thấy
  if (!products.length) {

    const result = await streamText({
      model: google("gemini-2.5-flash"),

      system: `
Không tìm thấy sản phẩm phù hợp.

- Xin lỗi ngắn gọn
- Hỏi lại tên sản phẩm
`,

      messages: recentMessages,
    });

    return result.toDataStreamResponse();
  }

  // 2. LẤY PRODUCT TỐT NHẤT
  const bestProduct = products[0];

  // 3. STREAM TOOL
  const result = await streamText({
    model: google("gemini-2.5-flash"),

    messages: recentMessages,

    tools: {
      openProductDetail,
    },

    toolChoice: "required",

    system: `
User muốn xem chi tiết sản phẩm.

Bắt buộc gọi tool openProductDetail
với đúng slug sản phẩm bên dưới.

PRODUCT:
- title: ${bestProduct.title}
- slug: ${bestProduct.slug}
`,
  });

  return result.toDataStreamResponse();
}


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

/*
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
*/

    // ================= 3. SEARCH (Lấy kết quả thô từ DB bằng Vector) =================
    let vectorResults = await searchProductSlugs({
      semanticQuery: parsed.semanticQuery || lastMessage,
      category: parsed.category || undefined,
      maxPrice: parsed.maxPrice || undefined,
      minPrice: parsed.minPrice || undefined,
    });

    // ================= 4. FALLBACK (Nếu DB không tìm thấy gì) =================
    if (
      !vectorResults.length &&
      (parsed.category || parsed.maxPrice || parsed.minPrice)
    ) {
      vectorResults = await searchProductSlugs({
        semanticQuery: parsed.category || parsed.semanticQuery || "sản phẩm",
        category: parsed.category || undefined,
        maxPrice: parsed.maxPrice || undefined,
        minPrice: parsed.minPrice || undefined,
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

    // 🔥 ================= 5.5. TIẾN HÀNH RERANK BẰNG GEMINI =================
    // Chuyển đổi dữ liệu vectorResults thành định dạng candidates đầu vào cho hàm Rerank
    const candidates = vectorResults.map(p => ({
      id: p.slug, // Dùng slug làm ID định danh duy nhất
      title: p.title,
      description: (p.metadata as any)?.description || p.title // Đảm bảo có mô tả sản phẩm
    }));

    const rankedResults = await rerankWithGemini(lastMessage, candidates);

    // Ánh xạ ngược lại để lấy đầy đủ data từ vectorResults dựa trên thứ tự đã Rerank
    const finalOrderedResults = rankedResults
      .map(r => vectorResults.find(p => p.slug === r.id))
      .filter((p): p is NonNullable<typeof p> => !!p);


    // ================= 6. BUILD CONTEXT (Dùng data đã được Rerank chuẩn chỉnh) =================
    const context = finalOrderedResults
      .slice(0, 8) // Lấy top những cái ngon nhất sau Rerank
      .map((p) => {
        const meta = p.metadata as any;
        return `
          ID: ${p.slug}
          Tên: ${p.title}
          Giá: ${meta?.minPrice ?? "?"} - ${meta?.maxPrice ?? "?"}
          Danh mục: ${meta?.categories?.join(", ") ?? "?"}
          `;
      })
      .join("\n");












    // ================= 7. FINAL RESPONSE =================

    const result = await streamText({
      model: google("gemini-2.5-flash"),

      maxSteps: 3,

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



// Chuyển chữ cái đầu tiên thành chữ hoa
function capitalizeFirstLetter(category: string) {
  if (!category) return "";

  return category[0].toLocaleUpperCase("vi-VN") + category.slice(1);
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

  if (maxPrice != null) {
    conditions.push(sql`(metadata->>'maxPrice')::numeric <= ${maxPrice}`);
  }

  if (minPrice != null) {
    conditions.push(sql`(metadata->>'minPrice')::numeric >= ${minPrice}`);
  }

  if (category) {
    let categoryConvert = capitalizeFirstLetter(category);
    conditions.push(sql`metadata->'categories' ? ${categoryConvert}`);
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


