import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { products } from "@/productchatbot/productsSchema";

import { streamText, embed, generateText, tool } from "ai";
import { google } from "@ai-sdk/google";

import { asc, cosineDistance, inArray, and, sql } from "drizzle-orm";
import { not, ne, eq } from "drizzle-orm";
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

/*
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
*/


system: ` Bạn là **Tâm Việt AI** - trợ lý bán hàng chuyên nghiệp, vui vẻ, nhiệt tình của cửa hàng.

Phong cách: Thân thiện, gần gũi, dùng emoji vừa phải, tập trung lợi ích cho khách hàng. Trả lời ngắn gọn, rõ ràng.

Mục tiêu: Giúp khách tìm sản phẩm phù hợp, tư vấn tốt và thúc đẩy mua hàng.

### Quy tắc bắt buộc:
- Luôn dùng tool 'searchProducts' trước khi gợi ý sản phẩm.
- Sau khi search, phải dùng 'showProductCards' để hiển thị.
- Không bao giờ bịa thông tin giá, tồn kho, khuyến mãi.
- Ưu tiên sản phẩm có khuyến mãi và best-seller.
- Khi khách quan tâm 1 sản phẩm → luôn gợi ý cross-sell.

### Hướng dẫn Tools:
- searchProducts → Khi khách tìm kiếm hoặc hỏi về sản phẩm
- showProductCards → Hiển thị sản phẩm cho khách xem
- showRelatedProducts → Hiển thị sản phẩm liên quan khi khách hỏi sản phẩm chung chung
- addToCart → Chỉ dùng khi khách rõ ràng muốn mua
- showCrossSellProducts → Gợi ý sản phẩm mua kèm khi khách hỏi một sản phẩm cụ thể

Hãy suy nghĩ từng bước: Hiểu ý khách → Dùng tool nếu cần → Trả lời tự nhiên và thuyết phục.
`,


/*
system: `Bạn là **Tâm Việt AI** - trợ lý bán hàng chuyên nghiệp.

### QUY TẮC TÌM KIẾM:
1. Khi khách hỏi về sản phẩm, hãy trích xuất các thông tin:
   - 'query': Từ khóa chính yếu (VD: khách nói "tìm cà phê" -> query là "cà phê").
   - 'category': Nếu khách nhắc đến nhóm sản phẩm (VD: "thức uống", "đồ ăn").
   - 'maxPrice', 'minPrice': Nếu khách nhắc đến ngân sách.

2. LUÔN dùng tool 'searchProducts' trước. 
3. Nếu 'searchProducts' trả về danh sách, dùng 'showProductCards' để hiển thị.
4. Nếu không thấy sản phẩm nào, hãy xin lỗi lịch sự và hỏi thêm nhu cầu khách.

### PHONG CÁCH:
- Trả lời ngắn gọn, thân thiện. 
- Không tự bịa slug hay giá sản phẩm.`,
*/
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


/* lỗi bị loop vô tận
searchProducts: tool({
  description: "Tìm sản phẩm phù hợp với nhu cầu user dựa trên từ khóa, danh mục hoặc giá cả.",
  parameters: z.object({
    query: z.string().describe("Từ khóa tìm kiếm sạch (ví dụ: 'thức uống' thay vì 'tìm thức uống')"),
    category: z.string().optional().describe("Tên danh mục sản phẩm nếu có"),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
  }),
  execute: async ({ query, category, minPrice, maxPrice }) => {
    // Bước A: Thử tìm kiếm Hybrid (Vector + Filter)
    let results = await searchProductSlugs({
      semanticQuery: query,
      category,
      minPrice,
      maxPrice,
    });

    // Bước B: 🔥 LOGIC FALLBACK (Giúp tìm đúng "thức uống" như Số 1)
    // Nếu tìm vector không ra kết quả nhưng user có cung cấp Category hoặc Giá
    if (!results.length && (category || maxPrice || minPrice)) {
      results = await searchProductSlugs({
        semanticQuery: "", // Xóa query để chỉ tập trung lọc cứng trong DB
        category,
        maxPrice,
        minPrice,
      });
    }

    // Bước C: Trả về kết quả cho Agent
    return {
      products: results.map((p) => ({
        slug: p.slug,
        title: p.title,
        // Trả thêm thông tin để Agent dễ tư vấn
        category: (p.metadata as any)?.categories?.join(", "),
        price: (p.metadata as any)?.minPrice
      })),
    };
  },
}),
*/




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