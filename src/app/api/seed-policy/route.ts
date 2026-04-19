import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/dbchatbot";
import { companyPolicies } from "@/dbchatbot/schema";
import { cosineDistance, sql, desc, gt } from "drizzle-orm";   // ← import thêm gt, desc

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 5) {
      return new Response("Câu hỏi quá ngắn!", { status: 400 });
    }

    // ==================== 1. Tạo Embedding ====================
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: lastMessage.trim(),
      // Khuyến nghị thêm để kiểm soát dimensions (tránh mismatch 3072 vs 1536/768)
      // providerOptions: { google: { outputDimensionality: 1536 } } // hoặc 768
    });

    // ==================== 2. Vector Search (Phiên bản sửa lỗi) ====================
    const distance = cosineDistance(companyPolicies.embedding, embedding); // dùng biến cho sạch

    const relevantDocs = await db
      .select({
        content: companyPolicies.content,
        // Tính similarity đúng cách
        similarity: sql<number>`1 - ${distance}`,
      })
      .from(companyPolicies)
      .where(gt(distance, 0.65))           // threshold trên distance (cosine distance), không phải trên similarity
      .orderBy(desc(sql<number>`1 - ${distance}`))   // hoặc orderBy(asc(distance)) cũng được
      .limit(5);

    // ==================== 3. Xây dựng system prompt ====================
    let systemInstruction = "";

    if (relevantDocs.length === 0) {
      systemInstruction = 
        "Bạn là trợ lý nhân sự. Hiện tại trong cơ sở dữ liệu chính sách KHÔNG có thông tin liên quan đến câu hỏi này. " +
        "Hãy trả lời lịch sự rằng bạn không tìm thấy quy định liên quan và không tự bịa thông tin.";
    } else {
      const context = relevantDocs
        .map((d, i) => `Tài liệu ${i+1}:\n${d.content}`)
        .join("\n\n---\n\n");

      systemInstruction = `Bạn là trợ lý nhân sự chuyên nghiệp của công ty. 
Hãy dựa CHỈ vào các chính sách dưới đây để trả lời chính xác, ngắn gọn và chuyên nghiệp:

---
${context}
---

Nếu thông tin không đủ hoặc không liên quan trực tiếp → hãy nói rõ "Tôi không tìm thấy quy định chính xác về vấn đề này trong tài liệu hiện có". Không được tự thêm thông tin ngoài tài liệu.`;
    }

    // ==================== 4. Stream Gemini ====================
    const result = await streamText({
      model: google('gemini-2.5-flash'),   // hoặc gemini-2.5-pro nếu cần mạnh hơn
      system: systemInstruction,
      messages,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("Lỗi RAG API:", error.message || error);
    return new Response(
      "Có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau.", 
      { status: 500 }
    );
  }
}