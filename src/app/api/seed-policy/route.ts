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

    // 1. Tạo Embedding (3072 dimensions - default của gemini-embedding-001)
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: lastMessage.trim(),
      // Nếu muốn giảm kích thước (khuyến nghị 1536 để cân bằng):
      // providerOptions: { google: { outputDimensionality: 1536 } }
    });

    // 2. Vector Search - Viết theo cách an toàn nhất
    const distanceExpr = cosineDistance(companyPolicies.embedding, embedding);

    const relevantDocs = await db
      .select({
        content: companyPolicies.content,
        similarity: sql<number>`1 - ${distanceExpr}`,   // vẫn giữ để hiển thị similarity
      })
      .from(companyPolicies)
      .where(gt(distanceExpr, 0.65))                    // threshold trên distance (0.6 ~ 0.75 tùy data)
      .orderBy(desc(sql<number>`1 - ${distanceExpr}`))  // hoặc .orderBy(asc(distanceExpr))
      .limit(5);

    // 3. Xây dựng prompt
    let systemInstruction = relevantDocs.length === 0 
      ? "Bạn là trợ lý nhân sự. Không tìm thấy thông tin liên quan trong chính sách công ty. Hãy trả lời lịch sự rằng bạn không có thông tin này và không tự bịa."
      : `Bạn là trợ lý nhân sự chuyên nghiệp. 
Dựa CHỈ vào các chính sách sau đây để trả lời chính xác và ngắn gọn:

---
${relevantDocs.map((d, i) => `Tài liệu ${i+1}: ${d.content}`).join("\n\n---\n\n")}
---

Nếu không đủ thông tin → nói rõ "Tôi không tìm thấy quy định chính xác về vấn đề này".`;

    // 4. Stream
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemInstruction,
      messages,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("Lỗi RAG API:", error.message || error);
    return new Response("Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.", { status: 500 });
  }
}