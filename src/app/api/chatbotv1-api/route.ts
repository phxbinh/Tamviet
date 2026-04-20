import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/dbchatbot";
import { companyPolicies } from "@/dbchatbot/schema";
import { cosineDistance, sql, and, eq, desc, asc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 5) {
      return new Response("Câu hỏi của bạn quá ngắn để tôi có thể tìm kiếm chính xác.", { status: 400 });
    }

    // ==================== 1. Tạo Embedding (3072 dims) ====================
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: lastMessage.trim(),
    });

    // ==================== 2. Vector Search Tối ưu Metadata ====================
    const distance = cosineDistance(companyPolicies.embedding, embedding);

    const relevantDocs = await db
      .select({
        title: companyPolicies.title,
        content: companyPolicies.content,
        category: companyPolicies.category,
        priority: companyPolicies.priority,
        distance: distance,
      })
      .from(companyPolicies)
      .where(
        and(
          eq(companyPolicies.isActive, true), // CHỈ lấy chính sách còn hiệu lực
          sql`${distance} < 0.6`             // Ngưỡng tin cậy: bỏ qua kết quả quá lệch
        )
      )
      .orderBy(
        asc(distance),                 // Ưu tiên kết quả đúng ý nghĩa nhất
        desc(companyPolicies.priority) // Nếu độ tương đồng bằng nhau, ưu tiên cấp độ quan trọng
      )
      .limit(5);

    // ==================== 3. Xây dựng System Instruction Thông minh ====================
    let systemInstruction = "";

    if (relevantDocs.length === 0) {
      systemInstruction = 
        "Bạn là trợ lý nhân sự. Hiện tại không tìm thấy thông tin chính sách nào trong dữ liệu khớp với câu hỏi. " +
        "Hãy xin lỗi lịch sự và đề nghị người dùng liên hệ trực tiếp phòng HC-NS. Tuyệt đối không tự bịa quy định.";
    } else {
      // Tích hợp Metadata vào Context để AI biết nguồn gốc
      const context = relevantDocs
        .map((doc, idx) => 
          `[Tài liệu ${idx + 1}: ${doc.title ?? 'Quy định chung'} | Danh mục: ${doc.category ?? 'N/A'}]\n${doc.content}`
        )
        .join("\n\n---\n\n");

      systemInstruction = `Bạn là Trợ lý Nhân sự AI chuyên nghiệp của công ty.

Nhiệm vụ: Giải đáp thắc mắc dựa trên tài liệu được cung cấp.

QUY TẮC PHẢN HỒI:
1. TÓM TẮT: Bắt đầu câu trả lời bằng 1 dòng tóm tắt ý chính nhất.
2. NỘI DUNG: Trình bày chi tiết, rõ ràng (có thể dùng bullet points).
3. TRÍCH DẪN: Đề cập rõ tên tài liệu bạn đang sử dụng để trả lời (ví dụ: "Theo ${relevantDocs[0].title}...").
4. GIỚI HẠN: Chỉ trả lời dựa trên thông tin có trong phần NGỮ CẢNH. Nếu không chắc chắn, hãy nói "Tôi không tìm thấy quy định cụ thể về vấn đề này".

NGỮ CẢNH:
---
${context}
---`;
    }

    // ==================== 4. Stream response với Gemini 2.0 Flash ====================
    const result = await streamText({
      model: google('gemini-2.0-flash'), // Sử dụng model Flash mới nhất để phản hồi nhanh
      system: systemInstruction,
      messages,
      temperature: 0.1, // Giảm độ sáng tạo để bot bám sát tài liệu, tránh "chém gió"
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("Lỗi RAG API:", error.message || error);
    return new Response("Hệ thống đang gặp sự cố khi truy xuất dữ liệu. Vui lòng thử lại sau.", { status: 500 });
  }
}
