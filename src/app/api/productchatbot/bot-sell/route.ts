// app/api/productchatbot/bot-sell/route.ts
import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
// CHÚ Ý: Import schema bảng products gốc của bạn ở đây
import { products } from "@/productchatbot/productsSchema"; 
import { streamText, embed, generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { asc, cosineDistance, inArray, eq } from "drizzle-orm";
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
      system: `Bạn là trợ lý bán hàng chuyên nghiệp.
      Dựa vào danh sách sản phẩm sau:
      ${context}
      
      YÊU CẦU:
      - Nếu sản phẩm phù hợp, BẮT BUỘC dùng tool 'showProductCards' để hiển thị.
      - Trả lời tự nhiên, nhấn mạnh vào lợi ích sản phẩm.
      - Tuyệt đối không tự bịa link ảnh, tool sẽ tự xử lý ảnh.`,
      messages: recentMessages,
/*
      tools: {
        showProductCards: tool({
          description: 'Truy vấn SQL để lấy ảnh thumbnail và giá chính xác từ database',
          parameters: z.object({
            slugs: z.array(z.string()).describe('Mảng các slug sản phẩm cần hiển thị'),
          }),
          execute: async ({ slugs }) => {
            // --- TRUY VẤN SQL TRỰC TIẾP VÀO BẢNG PRODUCTS ---
            const fullProducts = await db
              .select({
                title: productsTable.title,
                slug: productsTable.slug,
                thumbnail: productsTable.thumbnail, // Đây là cột chứa link ảnh bạn cần
                price: productsTable.price,
              })
              .from(productsTable)
              .where(inArray(productsTable.slug, slugs));

            // Format lại dữ liệu cho Frontend dễ dùng
            return fullProducts.map(p => ({
              title: p.title,
              slug: p.slug,
              image: p.thumbnail || "/placeholder-product.jpg",
              price: p.price ? `${new Intl.NumberFormat('vi-VN').format(p.price)}đ` : "Liên hệ",
              url: `/testSearchParam/products/${p.slug}`
            }));
          },
        }),
      },
*/

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
},


    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("❌ ERROR:", error);
    return new Response("Error occurred", { status: 500 });
  }
}


/*
prompt
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


/*
// Trong file app/api/productchatbot/bot-sell/route.ts

// ... các import khác
import { products } from "@/schema/products"; // Import schema vừa tạo
import { inArray } from "drizzle-orm";

// ... phần code Router và Vector Search giữ nguyên

// Trong định nghĩa tools của streamText:
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
}
*/













/**
 * Hàm chỉ tìm kiếm Slug từ Vector DB (Cực nhẹ token)
 */
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
    .limit(3);

  return rows;
}
