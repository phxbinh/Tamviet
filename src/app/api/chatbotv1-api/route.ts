/*
import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/chatbotv1";
import { companyPolicies } from "@/chatbotv1/schema";
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
          //sql`${distance} < 0.6`             // Ngưỡng tin cậy: bỏ qua kết quả quá lệch
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
*/



/*
import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/chatbotv1";
import { companyPolicies } from "@/chatbotv1/schema";
import { cosineDistance, sql, and, eq, asc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 5) {
      return new Response("Câu hỏi của bạn quá ngắn để tôi có thể tìm kiếm chính xác.", { status: 400 });
    }

    // ==================== 1. EMBEDDING ====================
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: lastMessage.trim(),
    });

    // ==================== 2. VECTOR SEARCH (SAFE) ====================

    const distance = cosineDistance(companyPolicies.embedding, embedding);

    const relevantDocs = await db
      .select({
        title: companyPolicies.title,
        content: companyPolicies.content,
        category: companyPolicies.category,
        priority: companyPolicies.priority,

        // ✅ FIX: wrap rõ ràng tránh lỗi SQL precedence
        //similarity: sql<number>`1 - (${distance})`,
      })
      .from(companyPolicies)
      .where(
        and(
          eq(companyPolicies.isActive, true),

          // ✅ optional threshold (khuyến nghị bật)
          // sql`${distance} < 0.4`
        )
      )
      // ✅ FIX: dùng asc(distance) là an toàn nhất
      .orderBy(asc(distance))
      .limit(5);

    // ==================== 3. SYSTEM INSTRUCTION ====================

    let systemInstruction = "";

    if (relevantDocs.length === 0) {
      systemInstruction =
        "Bạn là trợ lý nhân sự. Hiện tại không tìm thấy thông tin chính sách liên quan. " +
        "Hãy trả lời lịch sự rằng bạn không có thông tin này và KHÔNG được tự bịa.";
    } else {
      const context = relevantDocs
        .map((doc, idx) => `
[Tài liệu ${idx + 1}]
Tiêu đề: ${doc.title ?? 'Không rõ'}
Danh mục: ${doc.category ?? 'N/A'}

Nội dung:
${doc.content}
`)
        .join("\n\n---\n\n");

      systemInstruction = `Bạn là trợ lý nhân sự chuyên nghiệp.
      
      Nhiệm vụ: Trả lời CHỈ dựa trên dữ liệu được cung cấp.
      
      QUY TẮC BẮT BUỘC:
      1. Phải trích dẫn ÍT NHẤT 1 tài liệu
      2. Khi trích dẫn, PHẢI ghi rõ:
         - Tiêu đề
         - Danh mục
      3. Format trích dẫn như sau:
      
      (Theo: [Tiêu đề] - Danh mục: [Danh mục])
      
      4. KHÔNG được bỏ qua tiêu đề hoặc danh mục
      5. KHÔNG suy đoán ngoài dữ liệu
      
      NGỮ CẢNH:
      ---
      ${context}
      ---
      
      6. Nếu không đủ thông tin, hãy nói:
      "Tôi không tìm thấy quy định chính xác về vấn đề này trong tài liệu hiện có."
      
      `;
    }

    // ==================== 4. STREAM ====================

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemInstruction,
      messages,
      temperature: 0.1,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("❌ Lỗi RAG API:", error);

    return new Response(
      "Có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau.",
      { status: 500 }
    );
  }
}
*/


import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/chatbotv1";
import { companyPolicies } from "@/chatbotv1/schema";
import { cosineDistance, sql, and, eq, asc, desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content as string;

    if (!lastMessage || lastMessage.trim().length < 5) {
      return new Response("Câu hỏi của bạn quá ngắn.", { status: 400 });
    }

    // ==================== 1. EMBEDDING ====================
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: lastMessage.trim(),
    });

    const distance = cosineDistance(companyPolicies.embedding, embedding);

    // ==================== 2. LẤY TOP CHUNKS ====================
    const chunks = await db
      .select({
        documentId: companyPolicies.documentId,
        title: companyPolicies.title,
        content: companyPolicies.content,
        category: companyPolicies.category,
        chunkIndex: companyPolicies.chunkIndex,
        priority: companyPolicies.priority,
        distance: distance,
      })
      .from(companyPolicies)
      .where(
        and(
          eq(companyPolicies.isActive, true),
          sql`${distance} < 0.5` // 👉 bật threshold
        )
      )
      .orderBy(
        asc(distance),
        desc(companyPolicies.priority)
      )
      .limit(10); // 👉 lấy nhiều hơn 5 vì là chunk

    // ==================== 3. GROUP CHUNK THEO DOCUMENT ====================

    const grouped = new Map<string, any[]>();

    for (const chunk of chunks) {
      const key = chunk.documentId ?? "unknown";

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key)!.push(chunk);
    }

    // ==================== 4. BUILD CONTEXT ====================

    const contextDocs = Array.from(grouped.values())
      .slice(0, 3) // 👉 tối đa 3 document
      .map((docChunks, idx) => {
        // sort lại theo thứ tự chunk
        const sorted = docChunks.sort(
          (a, b) => (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0)
        );

        const first = sorted[0];

        return `
[Tài liệu ${idx + 1}]
Tiêu đề: ${first.title ?? 'Không rõ'}
Danh mục: ${first.category ?? 'N/A'}

Nội dung:
${sorted.map(c => c.content).join("\n")}
`;
      })
      .join("\n\n---\n\n");

    // ==================== 5. SYSTEM ====================

    let systemInstruction = "";

    if (!contextDocs || contextDocs.trim().length === 0) {
      systemInstruction = `
Bạn là trợ lý nhân sự.

KHÔNG tìm thấy dữ liệu liên quan.

Trả lời:
"Tôi không tìm thấy thông tin trong tài liệu hiện có."
`;
    } else {
      systemInstruction = `
Bạn là trợ lý nhân sự chuyên nghiệp.

CHỈ được trả lời dựa trên context.

BẮT BUỘC:
- Phải trích dẫn ít nhất 1 tài liệu
- Format:

(Theo: [Tiêu đề] - Danh mục: [Danh mục])

- Không suy đoán

Context:
---
${contextDocs}
---

Nếu không đủ thông tin:
"Tôi không tìm thấy quy định chính xác."
`;
    }

    // ==================== 6. STREAM ====================

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemInstruction,
      messages,
      temperature: 0.1,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("❌ Lỗi RAG API:", error);

    return new Response(
      "Có lỗi xảy ra.",
      { status: 500 }
    );
  }
}











