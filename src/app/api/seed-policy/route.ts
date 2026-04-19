import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/dbchatbot";
import { companyPolicies } from "@/dbchatbot/schema";
import { cosineDistance } from 'drizzle-orm';   // ← Import helper này
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 5) {
      return new Response("Câu hỏi quá ngắn!", { status: 400 });
    }

    // ==================== 1. Tạo Embedding (Fix quan trọng) ====================
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),   // ← Tên model đúng
      value: lastMessage.trim(),
      // Nếu muốn tiết kiệm bộ nhớ và giữ tương thích với 768 (không khuyến khích lắm):
      // providerOptions: { google: { outputDimensionality: 768 } }
    });

    // ==================== 2. Tìm kiếm vector (Dùng helper sạch hơn) ====================
    const similarityThreshold = 0.4; // Bạn có thể điều chỉnh (0.3 ~ 0.5)

    const relevantDocs = await db
      .select({
        content: companyPolicies.content,
        similarity: sql<number>`1 - ${cosineDistance(companyPolicies.embedding, embedding)}`
      })
      .from(companyPolicies)
      .where(sql`1 - ${cosineDistance(companyPolicies.embedding, embedding)} > ${similarityThreshold}`)
      .orderBy(sql`${cosineDistance(companyPolicies.embedding, embedding)}`)  // nhỏ nhất = giống nhất
      .limit(4);  // tăng lên 4 nếu cần

    // ==================== 3. Xây dựng context & system prompt ====================
    let systemInstruction = "";

    if (relevantDocs.length === 0) {
      systemInstruction = 
        "Bạn là trợ lý nhân sự. Hiện tại trong cơ sở dữ liệu chính sách KHÔNG có thông tin liên quan đến câu hỏi này. " +
        "Hãy trả lời lịch sự: 'Rất tiếc, tôi không tìm thấy quy định nào liên quan đến vấn đề này trong tài liệu chính sách của công ty.' " +
        "Tuyệt đối không tự bịa thông tin.";
    } else {
      const context = relevantDocs.map(d => d.content).join("\n\n---\n\n");
      systemInstruction = `Bạn là trợ lý nhân sự chuyên nghiệp. 
Hãy dựa CHỈ vào thông tin chính sách dưới đây để trả lời câu hỏi một cách chính xác và ngắn gọn:

---
${context}
---

Nếu thông tin không đủ hoặc không liên quan trực tiếp, hãy nói rõ rằng bạn không tìm thấy thông tin chính xác. Không được tự thêm thông tin ngoài tài liệu.`;
    }

    // ==================== 4. Gọi Gemini stream ====================
    const result = await streamText({
      model: google('gemini-2.5-flash'),        // hoặc gemini-3-flash nếu muốn mới hơn
      system: systemInstruction,
      messages,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("Lỗi RAG API:", error.message);
    return new Response(
      "Có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau.", 
      { status: 500 }
    );
  }
}