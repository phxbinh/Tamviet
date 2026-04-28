// app/api/productchatbot/bot-sell/route.ts

import { db } from "@/productchatbot";
import { productDocuments } from "@/productchatbot/schema";
import { streamText, embed, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { sql, asc, desc, cosineDistance } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 3) {
      return new Response("Câu hỏi quá ngắn.", { status: 400 });
    }

    const recentMessages = messages.slice(-6);

    // ================= ROUTER =================
    const { text: intent } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `Classify intent:
      - PRODUCT: tìm sản phẩm, giá, màu, size
      - GREETING: chào hỏi
      - OTHER: còn lại
      Trả về đúng 1 từ.`,
      prompt: lastMessage,
    });

    console.log("🚦 Intent:", intent);

    // ================= GREETING =================
    if (intent === "GREETING") {
      const result = await streamText({
        model: google("gemini-2.5-flash"),
        system: "Bạn là chatbot bán hàng thân thiện. Trả lời ngắn gọn.",
        messages: recentMessages,
      });

      return result.toDataStreamResponse();
    }

    // ================= PRODUCT SEARCH =================
    if (intent === "PRODUCT") {
      const products = await searchProducts(lastMessage);
      console.log(products)
      // ❌ không tìm thấy
      if (!products.length) {
        console.log("🆘 Không tìm thấy sản phẩm:");
        const result = await streamText({
          model: google("gemini-2.5-flash"),
          system: "Bạn là trợ lý bán hàng. Nếu không có sản phẩm, hãy xin lỗi và gợi ý lại.",
          messages: [
            {
              role: "user",
              content: lastMessage,
            },
          ],
        });

        return result.toDataStreamResponse();
      }

      // ✅ build context
      const context = products
        .map(
          (p, i) => `
            [Sản phẩm ${i + 1}]
            Tên: ${p.title}
            Link: ${p.url}
            Mô tả: ${p.preview}
            `
        )
        .join("\n\n");

      const systemPrompt = `
        Bạn là trợ lý bán hàng.
        
        Dựa vào danh sách sản phẩm sau:
        ${context}
        
        Yêu cầu:
        - Gợi ý sản phẩm phù hợp
        - Đưa link để người dùng click
        - Trả lời tự nhiên, không liệt kê máy móc
        - Nếu nhiều sản phẩm → chọn 1-2 cái tốt nhất
        `;
        
        const result = await streamText({
          model: google("gemini-2.5-flash"),
          system: systemPrompt,
          messages: recentMessages,
          temperature: 0.4,
        });
      return result.toDataStreamResponse();
    }

    // ================= DEFAULT =================
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: "Bạn là chatbot bán hàng.",
      messages: recentMessages,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("❌ ERROR:", error);
    return new Response("Error occurred", { status: 500 });
  }
}

async function searchProducts(query: string) {
  const { embedding } = await embed({
    model: google.embedding("gemini-embedding-001"), // ⚠️ đồng bộ với DB
    value: query,
  });

  const distance = cosineDistance(productDocuments.embedding, embedding);

  const rows = await db
    .select({
      title: productDocuments.title,
      slug: productDocuments.slug,
      content: productDocuments.content,
      metadata: productDocuments.metadata,
      distance,
    })
    .from(productDocuments)
    // ❌ bỏ filter cứng để debug
    // .where(sql`${distance} < 0.5`)
    .orderBy(asc(distance)) // ✅ gần nhất lên đầu
    .limit(3);

  return rows.map((r) => ({
    title: r.title,
    slug: r.slug,
    url: `/testSearchParam/products/${r.slug}`,
    preview: r.content.slice(0, 200) + "...",
    metadata: r.metadata,
    distance: r.distance, // 👉 debug
  }));
}
