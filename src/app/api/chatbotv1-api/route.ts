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



/* Bản chạy được - Nhưng chưa có chunk_index và document_id
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


/* bản chạy được
// có document_id và chunk_index
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
          //sql`${distance} < 0.5` // 👉 bật threshold
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
*/



/* ✅Hoàn toàn chạy được -> KẾT QUẢ CHUẨN HƠN MẤY CÁI Ở TRÊN */
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

    // ==================== 2. LẤY CHUNKS (CÓ FILTER) ====================
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
          sql`${distance} < 0.40` // 🔥 FIX QUAN TRỌNG
        )
      )
      .orderBy(
        asc(distance),
        desc(companyPolicies.priority)
      )
      .limit(20); // 🔥 lấy rộng hơn để còn lọc

    // Nếu không có chunk đủ tốt
    if (!chunks || chunks.length === 0) {
      const result = await streamText({
        model: google('gemini-2.5-flash'),
        system: `
          Bạn là trợ lý nhân sự.
          
          KHÔNG tìm thấy dữ liệu liên quan.
          
          Trả lời:
          "Tôi không tìm thấy thông tin trong tài liệu hiện có."
          `,
        messages,
        temperature: 0,
      });

      return result.toDataStreamResponse();
    }

// Kiểm tra chunk và distance
console.log(
  chunks.map(c => ({
    title: c.title,
    distance: c.distance
  }))
);

    // ==================== 3. GROUP THEO DOCUMENT ====================
    const grouped = new Map<string, any[]>();

    for (const chunk of chunks) {
      const key = chunk.documentId ?? "unknown";

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key)!.push(chunk);
    }

    // ==================== 4. RANK DOCUMENT ====================
    const rankedDocs = Array.from(grouped.values())
      .map((docChunks) => {
        const bestScore = Math.min(...docChunks.map(c => c.distance));

        return {
          chunks: docChunks,
          score: bestScore
        };
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 3); // 🔥 top 3 document thật sự liên quan

    // ==================== 5. BUILD CONTEXT (CÓ KIỂM SOÁT) ====================
    const contextDocs = rankedDocs
      .map((doc, idx) => {
        const sorted = doc.chunks.sort(
          (a, b) => (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0)
        );

        const first = sorted[0];

        return `
[Tài liệu ${idx + 1}]
Tiêu đề: ${first.title ?? 'Không rõ'}
Danh mục: ${first.category ?? 'N/A'}

Nội dung:
${sorted.slice(0, 3).map(c => c.content).join("\n")}
`;
      })
      .join("\n\n---\n\n");

    // ==================== 6. SYSTEM (ÉP CHẶT) ====================
    const systemInstruction = `
Bạn là trợ lý nhân sự chuyên nghiệp, làm việc với các tài liệu mang tính quy định nội bộ và pháp lý.

NHIỆM VỤ:
- Chỉ trả lời dựa trên thông tin có trong CONTEXT được cung cấp.
- Mục tiêu là đảm bảo độ chính xác, tính nhất quán và khả năng truy xuất nguồn.
- Phải trả lời TRỰC TIẾP vào câu hỏi
- Không được trả lời chung chung
- Chỉ chọn thông tin LIÊN QUAN NHẤT từ context
- Không suy đoán ngoài dữ liệu

=====================
QUY TẮC BẮT BUỘC
=====================

1. NGUỒN THÔNG TIN
- Chỉ sử dụng thông tin từ CONTEXT
- Tuyệt đối KHÔNG suy đoán, KHÔNG bổ sung kiến thức bên ngoài
- KHÔNG được diễn giải vượt quá nội dung gốc

2. TRÍCH DẪN (BẮT BUỘC)
- Phải trích dẫn ÍT NHẤT 1 tài liệu
- Mỗi thông tin quan trọng phải gắn với ít nhất 1 nguồn
- Mỗi trích dẫn PHẢI có đầy đủ:
  + Tiêu đề
  + Danh mục

3. FORMAT TRÍCH DẪN (KHÔNG ĐƯỢC SAI)
(Theo: [Tiêu đề] - Danh mục: [Danh mục])

- Không được thiếu bất kỳ thành phần nào
- Không thay đổi format
- Không viết lại theo cách khác

4. XỬ LÝ NHIỀU NGUỒN
- Nếu có nhiều tài liệu liên quan:
  + Có thể trích dẫn nhiều nguồn
  + Không được gộp sai hoặc làm sai lệch nội dung từng tài liệu

5. XỬ LÝ THIẾU THÔNG TIN (BẮT BUỘC)
Nếu CONTEXT không có đủ thông tin để trả lời chính xác, phải trả lời NGUYÊN VĂN:

"Tôi không tìm thấy quy định chính xác về vấn đề này trong tài liệu hiện có."

- Không được trả lời một phần
- Không được suy đoán để “lấp chỗ trống”

6. ĐỘ CHÍNH XÁC & TRÁCH NHIỆM
- Ưu tiên trích dẫn nguyên ý hơn là diễn giải
- Không đơn giản hóa làm mất ý nghĩa pháp lý
- Không tạo ra quy định không tồn tại trong tài liệu

7. KIỂM TRA TRƯỚC KHI TRẢ LỜI
Trước khi trả lời, phải đảm bảo:
- Có ít nhất 1 trích dẫn hợp lệ
- Mỗi trích dẫn có đủ Tiêu đề + Danh mục
- Không có nội dung nào nằm ngoài CONTEXT

CONTEXT:
---
${contextDocs}
---
`;

    // ==================== 7. GENERATE ====================
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemInstruction,
      messages,
      temperature: 0, // 🔥 giảm randomness tối đa
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





/*
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

// ==================== 1. PREP QUERY ====================
const queryText = lastMessage.trim().toLowerCase();

const keywords = queryText
  .split(/\s+/)
  .filter(k => k.length > 2);

// ==================== 2. EMBEDDING ====================
const { embedding } = await embed({
  model: google.embedding('gemini-embedding-001'),
  value: queryText,
});

// ==================== 3. VECTOR ====================
const distance = cosineDistance(companyPolicies.embedding, embedding);
//const similarity = sql<number>`1 - ${distance}`;
const similarity = sql<number>`1.0 - (${distance})`;

// ==================== 4. KEYWORD SCORE ====================
const keywordScore = sql<number>`
  (${sql.join(
    keywords.map(k => sql`
      CASE 
        WHEN LOWER(${companyPolicies.content}) LIKE ${'%' + k + '%'} THEN 1 
        ELSE 0 
      END
    `),
    sql` + `
  )}) / ${keywords.length || 1}
`;

// ==================== 5. TITLE BOOST ====================
const titleScore = sql<number>`
  (${sql.join(
    keywords.map(k => sql`
      CASE 
        WHEN LOWER(${companyPolicies.title}) LIKE ${'%' + k + '%'} THEN 1 
        ELSE 0 
      END
    `),
    sql` + `
  )}) / ${keywords.length || 1}
`;

// ==================== 6. CATEGORY BOOST ====================
const categoryScore = sql<number>`
  (${sql.join(
    keywords.map(k => sql`
      CASE 
        WHEN LOWER(${companyPolicies.category}) LIKE ${'%' + k + '%'} THEN 1 
        ELSE 0 
      END
    `),
    sql` + `
  )}) / ${keywords.length || 1}
`;

// ==================== 7. EXACT MATCH ====================
const exactMatch = sql<number>`
  CASE 
    WHEN LOWER(${companyPolicies.content}) LIKE ${'%' + queryText + '%'} THEN 1
    ELSE 0
  END
`;

// ==================== 8. FINAL SCORE ====================
const finalScore = sql<number>`
  (${similarity} * 0.55) +
  (${keywordScore} * 0.25) +
  (${titleScore} * 0.15) +
  (${categoryScore} * 0.05) +
  (${exactMatch} * 0.1)
`;

// ==================== 9. QUERY ====================
const chunks = await db
  .select({
    documentId: companyPolicies.documentId,
    title: companyPolicies.title,
    content: companyPolicies.content,
    category: companyPolicies.category,
    chunkIndex: companyPolicies.chunkIndex,
    priority: companyPolicies.priority,

    distance: distance,
    similarity: similarity,
    finalScore: finalScore,
  })
  .from(companyPolicies)
  .where(eq(companyPolicies.isActive, true))
  .orderBy(desc(finalScore)) // 🔥 QUAN TRỌNG
  .limit(20);


    // Nếu không có chunk đủ tốt
    if (!chunks || chunks.length === 0) {
      const result = await streamText({
        model: google('gemini-2.5-flash'),
        system: `
          Bạn là trợ lý nhân sự.
          
          KHÔNG tìm thấy dữ liệu liên quan.
          
          Trả lời:
          "Tôi không tìm thấy thông tin trong tài liệu hiện có."
          `,
        messages,
        temperature: 0,
      });

      return result.toDataStreamResponse();
    }

    // ==================== 3. GROUP THEO DOCUMENT ====================
    const grouped = new Map<string, any[]>();

    for (const chunk of chunks) {
      const key = chunk.documentId ?? "unknown";

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key)!.push(chunk);
    }

    // ==================== 4. RANK DOCUMENT ====================
const rankedDocs = Array.from(grouped.values())
  .map((docChunks) => {
    const bestScore = Math.max(...docChunks.map(c => c.finalScore));

    return {
      chunks: docChunks,
      score: bestScore
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);

    // ==================== 5. BUILD CONTEXT (CÓ KIỂM SOÁT) ====================
    const contextDocs = rankedDocs
      .map((doc, idx) => {
        const sorted = doc.chunks.sort(
          (a, b) => (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0)
        );

        const first = sorted[0];

        return `
[Tài liệu ${idx + 1}]
Tiêu đề: ${first.title ?? 'Không rõ'}
Danh mục: ${first.category ?? 'N/A'}

Nội dung:
${sorted.slice(0, 3).map(c => c.content).join("\n")}
`;
      })
      .join("\n\n---\n\n");

    // ==================== 6. SYSTEM (ÉP CHẶT) ====================
    const systemInstruction = `
Bạn là trợ lý nhân sự chuyên nghiệp, làm việc với các tài liệu mang tính quy định nội bộ và pháp lý.

NHIỆM VỤ:
- Chỉ trả lời dựa trên thông tin có trong CONTEXT được cung cấp.
- Mục tiêu là đảm bảo độ chính xác, tính nhất quán và khả năng truy xuất nguồn.
- Phải trả lời TRỰC TIẾP vào câu hỏi
- Không được trả lời chung chung
- Chỉ chọn thông tin LIÊN QUAN NHẤT từ context
- Không suy đoán ngoài dữ liệu

=====================
QUY TẮC BẮT BUỘC
=====================

1. NGUỒN THÔNG TIN
- Chỉ sử dụng thông tin từ CONTEXT
- Tuyệt đối KHÔNG suy đoán, KHÔNG bổ sung kiến thức bên ngoài
- KHÔNG được diễn giải vượt quá nội dung gốc

2. TRÍCH DẪN (BẮT BUỘC)
- Phải trích dẫn ÍT NHẤT 1 tài liệu
- Mỗi thông tin quan trọng phải gắn với ít nhất 1 nguồn
- Mỗi trích dẫn PHẢI có đầy đủ:
  + Tiêu đề
  + Danh mục

3. FORMAT TRÍCH DẪN (KHÔNG ĐƯỢC SAI)
(Theo: [Tiêu đề] - Danh mục: [Danh mục])

- Không được thiếu bất kỳ thành phần nào
- Không thay đổi format
- Không viết lại theo cách khác

4. XỬ LÝ NHIỀU NGUỒN
- Nếu có nhiều tài liệu liên quan:
  + Có thể trích dẫn nhiều nguồn
  + Không được gộp sai hoặc làm sai lệch nội dung từng tài liệu

5. XỬ LÝ THIẾU THÔNG TIN (BẮT BUỘC)
Nếu CONTEXT không có đủ thông tin để trả lời chính xác, phải trả lời NGUYÊN VĂN:

"Tôi không tìm thấy quy định chính xác về vấn đề này trong tài liệu hiện có."

- Không được trả lời một phần
- Không được suy đoán để “lấp chỗ trống”

6. ĐỘ CHÍNH XÁC & TRÁCH NHIỆM
- Ưu tiên trích dẫn nguyên ý hơn là diễn giải
- Không đơn giản hóa làm mất ý nghĩa pháp lý
- Không tạo ra quy định không tồn tại trong tài liệu

7. KIỂM TRA TRƯỚC KHI TRẢ LỜI
Trước khi trả lời, phải đảm bảo:
- Có ít nhất 1 trích dẫn hợp lệ
- Mỗi trích dẫn có đủ Tiêu đề + Danh mục
- Không có nội dung nào nằm ngoài CONTEXT

CONTEXT:
---
${contextDocs}
---
`;



console.log("CHUNKS:", chunks.length);
console.log("RANKED:", rankedDocs.length);
console.log("CONTEXT:", contextDocs);
// Kiểm tra chunk và distance
console.log(
  chunks.map(c => ({
    title: c.title,
    distance: c.distance
  }))
);


    // ==================== 7. GENERATE ====================
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemInstruction,
      messages,
      temperature: 0, // 🔥 giảm randomness tối đa
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

*/















