// app/api/productchatbot/bot-sell/route.ts
/* Dùng được ⛳️🟢
import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
// CHÚ Ý: Import schema bảng products gốc ở DB PostgreSQL
import { products } from "@/productchatbot/productsSchema"; 
import { streamText, embed, generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { asc, cosineDistance, inArray, eq } from "drizzle-orm";
import { and, not, ne } from "drizzle-orm";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 3) {
      return new Response("Câu hỏi quá ngắn.", { status: 400 });
    }

    const recentMessages = messages.slice(-6);

    // ================= 1. ROUTER =================
    const { text: intent } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `Classify intent: PRODUCT, GREETING, OTHER. Trả về đúng 1 từ.`,
      prompt: lastMessage,
    });

    // ================= 2. GREETING & OTHER =================
    if (intent !== "PRODUCT") {
      const result = await streamText({
        model: google("gemini-2.5-flash"),
        system: "Bạn là chatbot bán hàng thân thiện của Tâm Việt. Trả lời ngắn gọn và gợi ý khách tìm sản phẩm.",
        messages: recentMessages,
      });
      return result.toDataStreamResponse();
    }

    // ================= 3. VECTOR SEARCH (Lấy danh sách Slug tiềm năng) =================
    const vectorResults = await searchProductSlugs(lastMessage);
    
    if (!vectorResults.length) {
      const result = await streamText({
        model: google("gemini-2.5-flash"),
        system: "Bạn là trợ lý bán hàng. Không tìm thấy sản phẩm, hãy xin lỗi và hỏi khách có muốn tìm loại khác không.",
        messages: [{ role: "user", content: lastMessage }],
      });
      return result.toDataStreamResponse();
    }

    // Context rút gọn tối đa để tiết kiệm token
    const context = vectorResults.map(p => `ID: ${p.slug} | Tên: ${p.title}`).join("\n");

    // ================= 4. GENERATE RESPONSE + SQL TOOL =================
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      maxSteps: 3,
      system: `Bạn là trợ lý bán hàng chuyên nghiệp.
      Dựa vào danh sách sản phẩm sau:
      ${context}
      
      YÊU CẦU:
      - Nếu sản phẩm phù hợp, BẮT BUỘC dùng tool 'showProductCards' để hiển thị.
      - Sau khi tìm được sản phẩm, BẮT BUỘC dùng tool 'showRelatedProducts' để hiện thị sản phẩm liên quan.
      - Trả lời tự nhiên, nhấn mạnh vào lợi ích sản phẩm.
      - Tuyệt đối không tự bịa link ảnh, tool sẽ tự xử lý ảnh.`,
      messages: recentMessages,
      tools: {
        showProductCards: tool({
          description: 'Truy vấn thông tin ảnh và giá từ bảng products',
          parameters: z.object({
            slugs: z.array(z.string()).describe('Mảng các slug sản phẩm'),
          }),
          execute: async ({ slugs }) => {
            // Truy vấn trực tiếp vào bảng products chính
            const data = await db
              .select({
                title: products.name,           // Map 'name' từ SQL thành 'title' cho UI
                slug: products.slug,
                image: products.thumbnail_url,  // Lấy đúng cột thumbnail_url
                description: products.short_description
              })
              .from(products)
              .where(inArray(products.slug, slugs));

            const related = await getRelatedProducts(slugs);

            return { 
              products: data.map(p => ({
                ...p,
                image: p.image || "/placeholder-product.jpg",
                url: `/testSearchParam/products/${p.slug}`,
                // Vì bảng products của bạn chưa có cột price trực tiếp (có thể ở bảng biến thể),
                // tạm thời để "Liên hệ" hoặc bạn có thể join thêm bảng price nếu có.
                price: "Liên hệ" 
              })),
                related: related.map(p => ({
                title: p.name,
                slug: p.slug,
                image: p.thumbnail_url || "/placeholder.jpg",
                price: "Liên hệ",
                url: `/testSearchParam/products/${p.slug}`
              }))
            };
          },
        }),
        showRelatedProducts: tool({
          description: 'Hiển thị sản phẩm liên quan',
          parameters: z.object({
            slugs: z.array(z.string())
          }),
        
          execute: async ({ slugs }) => {
        
            const related = await getRelatedProducts(slugs);
        
            return related.map(p => ({
              title: p.name,
              slug: p.slug,
              image: p.thumbnail_url || "/placeholder.jpg",
              price: "Liên hệ",
              url: `/testSearchParam/products/${p.slug}`
            }));
          }
        }),
      },
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("❌ ERROR:", error);
    return new Response("Error occurred", { status: 500 });
  }
}
⛳️🟢 */



/* Chạy được với showProductCards
      tools: {
        showProductCards: tool({
          description: 'Truy vấn thông tin ảnh và giá từ bảng products',
          parameters: z.object({
            slugs: z.array(z.string()).describe('Mảng các slug sản phẩm'),
          }),
          execute: async ({ slugs }) => {
            // Truy vấn trực tiếp vào bảng products chính
            const data = await db
              .select({
                title: products.name,           // Map 'name' từ SQL thành 'title' cho UI
                slug: products.slug,
                image: products.thumbnail_url,  // Lấy đúng cột thumbnail_url
                description: products.short_description
              })
              .from(products)
              .where(inArray(products.slug, slugs));
      
            return data.map(p => ({
              ...p,
              image: p.image || "/placeholder-product.jpg",
              url: `/testSearchParam/products/${p.slug}`,
              // Vì bảng products của bạn chưa có cột price trực tiếp (có thể ở bảng biến thể),
              // tạm thời để "Liên hệ" hoặc bạn có thể join thêm bảng price nếu có.
              price: "Liên hệ" 
            }));
          },
        }),
        showRelatedProducts: tool({
          description: 'Hiển thị sản phẩm liên quan',
          parameters: z.object({
            slugs: z.array(z.string())
          }),
        
          execute: async ({ slugs }) => {
        
            const related = await getRelatedProducts(slugs);
        
            return related.map(p => ({
              title: p.name,
              slug: p.slug,
              image: p.thumbnail_url || "/placeholder.jpg",
              price: "Liên hệ",
              url: `/testSearchParam/products/${p.slug}`
            }));
          }
        }),
      },
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("❌ ERROR:", error);
    return new Response("Error occurred", { status: 500 });
  }
}
*/

/*
prompt -> Yêu cầu cho AI agent
const result = await streamText({
  model: google("gemini-1.5-flash"),
  system: `Bạn là trợ lý bán hàng chuyên nghiệp. 
  Dựa vào danh sách: \n${productContext}\n
  
  QUY TẮC CỐ ĐỊNH:
  - Khi người dùng hỏi về sản phẩm cụ thể, bạn PHẢI gọi tool 'showProductCards' với các slug tương ứng.
  - KHÔNG ĐƯỢC chỉ trả lời bằng văn bản nếu sản phẩm đó có trong danh sách.
  - Sau khi gọi tool, hãy viết một câu ngắn gọn để giới thiệu các thẻ sản phẩm bên dưới.`,
  messages: recentMessages,
  tools: {
    showProductCards: tool({
      // ... giữ nguyên phần định nghĩa tool ...
    }),
  },
});
*/


/**
 * Hàm chỉ tìm kiếm Slug từ Vector DB (Cực nhẹ token)
 */
/* Dùng được ⛳️🟢
async function searchProductSlugs(query: string) {
  const { embedding } = await embed({
    model: google.embedding("gemini-embedding-001"),
    value: query,
  });

  const distance = cosineDistance(productDocuments.embedding, embedding);
  
  const rows = await db
    .select({
      title: productDocuments.title,
      slug: productDocuments.slug,
    })
    .from(productDocuments)
    .orderBy(asc(distance))
    .limit(6);

  return rows;
}
⛳️🟢 */

/*
showRelatedProducts: tool({
  description: 'Hiển thị sản phẩm liên quan',
  parameters: z.object({
    slugs: z.array(z.string())
  }),

  execute: async ({ slugs }) => {

    const related = await getRelatedProducts(slugs);

    return related.map(p => ({
      title: p.name,
      slug: p.slug,
      image: p.thumbnail_url || "/placeholder.jpg",
      price: "Liên hệ",
      url: `/testSearchParam/products/${p.slug}`
    }));
  }
})
*/

/*
async function getRelatedProducts(slugs: string[]) {

  // 1. lấy category
  const base = await db
    .select({
      product_type: products.product_type
    })
    .from(products)
    .where(inArray(products.slug, slugs));

  const productTypes = base.map(p => p.product_type);

  // 2. lấy related
  const related = await db
    .select({
      name: products.name,
      slug: products.slug,
      thumbnail_url: products.thumbnail_url
    })
    .from(products)
    .where(inArray(products.product_type, productTypes))
    .limit(6);

  return related;
}
*/

// =================== NGẮT ===============
// app/api/productchatbot/bot-sell/route.ts

import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { products } from "@/productchatbot/productsSchema";

import { streamText, embed, generateText, tool } from "ai";
import { google } from "@ai-sdk/google";

import { asc, cosineDistance, inArray, and, sql } from "drizzle-orm";
import { not, ne } from "drizzle-orm";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 3) {
      return new Response("Câu hỏi quá ngắn.", { status: 400 });
    }

    const recentMessages = messages.slice(-6);

    // ================= 1. ROUTER =================
    const { text: intent } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `Classify intent: PRODUCT, GREETING, OTHER. Trả về đúng 1 từ.`,
      prompt: lastMessage,
    });

    if (intent !== "PRODUCT") {
      const result = await streamText({
        model: google("gemini-2.5-flash"),
        system: "Bạn là chatbot bán hàng thân thiện. Trả lời ngắn gọn và gợi ý khách tìm sản phẩm.",
        messages: recentMessages,
      });
      return result.toDataStreamResponse();
    }

    // ================= 2. PARSE QUERY =================
    const { text: parsedText } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `
Trích xuất JSON từ câu người dùng.

Fields:
- semanticQuery: string
- category: string | null
- maxPrice: number | null
- minPrice: number | null

Chỉ trả JSON.
`,
      prompt: lastMessage,
    });

    let parsed: any;
    try {
      parsed = JSON.parse(parsedText);
    } catch {
      parsed = { semanticQuery: lastMessage };
    }

    // ================= 3. HYBRID SEARCH =================
    let vectorResults = await searchProductSlugs({
      semanticQuery: parsed.semanticQuery || lastMessage,
      category: parsed.category,
      maxPrice: parsed.maxPrice,
      minPrice: parsed.minPrice,
    });

    // 🔥 Fallback nếu semantic fail nhưng filter có
    if (!vectorResults.length && (parsed.category || parsed.maxPrice)) {
      const fallback = await searchProductSlugs({
        semanticQuery: "",
        category: parsed.category,
        maxPrice: parsed.maxPrice,
        minPrice: parsed.minPrice,
      });

      if (fallback.length) {
        vectorResults = fallback;
      }
    }

    if (!vectorResults.length) {
      const result = await streamText({
        model: google("gemini-2.5-flash"),
        system: "Không tìm thấy sản phẩm phù hợp, hãy xin lỗi và hỏi lại khách.",
        messages: [{ role: "user", content: lastMessage }],
      });
      return result.toDataStreamResponse();
    }

    const context = vectorResults
      .map(p => `ID: ${p.slug} | Tên: ${p.title}`)
      .join("\n");

    // ================= 4. RESPONSE + TOOL =================
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      maxSteps: 3,
      system: `Bạn là trợ lý bán hàng.

Danh sách sản phẩm:
${context}

YÊU CẦU:
- BẮT BUỘC dùng tool showProductCards nếu có sản phẩm phù hợp
- Sau đó dùng showRelatedProducts
- Không bịa dữ liệu`,
      messages: recentMessages,
      tools: {
        showProductCards: tool({
          description: "Hiển thị sản phẩm",
          parameters: z.object({
            slugs: z.array(z.string()),
          }),
          execute: async ({ slugs }) => {
            const data = await db
              .select({
                title: products.name,
                slug: products.slug,
                image: products.thumbnail_url,
                description: products.short_description,
              })
              .from(products)
              .where(inArray(products.slug, slugs));

            const related = await getRelatedProducts(slugs);

            return {
              products: data.map(p => ({
                ...p,
                image: p.image || "/placeholder.jpg",
                price: "Liên hệ",
                url: `/testSearchParam/products/${p.slug}`,
              })),
              related: related.map(p => ({
                title: p.name,
                slug: p.slug,
                image: p.thumbnail_url || "/placeholder.jpg",
                price: "Liên hệ",
                url: `/testSearchParam/products/${p.slug}`,
              })),
            };
          },
        }),

        showRelatedProducts: tool({
          description: "Sản phẩm liên quan",
          parameters: z.object({
            slugs: z.array(z.string()),
          }),
          execute: async ({ slugs }) => {
            const related = await getRelatedProducts(slugs);

            return related.map(p => ({
              title: p.name,
              slug: p.slug,
              image: p.thumbnail_url || "/placeholder.jpg",
              price: "Liên hệ",
              url: `/testSearchParam/products/${p.slug}`,
            }));
          },
        }),
      },
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("❌ ERROR:", error);
    return new Response("Error occurred", { status: 500 });
  }
}


// ================= SEARCH FUNCTION =================

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
    })
    .from(productDocuments)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(distance))
    .limit(8);

  return rows;
}








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


