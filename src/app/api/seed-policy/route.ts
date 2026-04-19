import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/dbchatbot";
import { companyPolicies } from "@/dbchatbot/schema";
import { cosineDistance, sql, gt, desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 5) {
      return new Response("Câu hỏi quá ngắn!", { status: 400 });
    }

    // ==================== 1. Tạo Embedding (3072 dims) ====================
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: lastMessage.trim(),
    });

    // ==================== 2. Vector Search - Cách viết AN TOÀN NHẤT ====================
    const distance = cosineDistance(companyPolicies.embedding, embedding);

    const relevantDocs = await db
      .select({
        content: companyPolicies.content,
        similarity: sql<number>`1 - (${distance})`,   // dùng ngoặc để Drizzle parse rõ hơn
      })
      .from(companyPolicies)
      //.where(gt(distance, 0.35))                      // ← Dùng gt trên distance (không dùng 1 - distance)
      //.orderBy(desc(sql<number>`1 - (${distance})`))  // hoặc .orderBy(asc(distance))
      .orderBy(asc(distance))
      .limit(5);

    // ==================== 3. System Instruction ====================
    let systemInstruction = "";

    if (relevantDocs.length === 0) {
      systemInstruction = 
        "Bạn là trợ lý nhân sự. Hiện tại không tìm thấy thông tin chính sách liên quan đến câu hỏi. " +
        "Hãy trả lời lịch sự rằng bạn không có thông tin này và không tự bịa thông tin.";
    } else {
      const context = relevantDocs
        .map((doc, idx) => `Tài liệu ${idx + 1}:\n${doc.content}`)
        .join("\n\n---\n\n");

      systemInstruction = `Bạn là trợ lý nhân sự chuyên nghiệp.
Hãy trả lời dựa CHỈ vào các chính sách sau đây. Trả lời ngắn gọn, chính xác và chuyên nghiệp:

---
${context}
---

Nếu không đủ thông tin hoặc không liên quan trực tiếp, hãy nói rõ: "Tôi không tìm thấy quy định chính xác về vấn đề này trong tài liệu hiện có". Không tự thêm thông tin ngoài tài liệu.`;
    }

    // ==================== 4. Stream response ====================
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemInstruction,
      messages,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("Lỗi RAG API:", error.message || error);
    return new Response("Có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau.", { status: 500 });
  }
}