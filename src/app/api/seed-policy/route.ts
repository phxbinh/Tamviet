/* Sử dụng cho openAI -> do cần master card nên chưa
dùng
import { db } from "@/dbchatbot";
import { companyPolicies } from "@/dbchatbot/schema";
import { generateEmbedding } from "@/dbchatbot/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content, metadata } = await req.json();

  try {
    // 1. Biến chữ thành tọa độ
    const embedding = await generateEmbedding(content);

    // 2. Lưu vào Neon qua Drizzle
    await db.insert(companyPolicies).values({
      content,
      embedding,
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi rồi đại ca ơi" }, { status: 500 });
  }
}
*/


// ✅Dùng với gemini
// app/api/chat/route.ts
/*
import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/dbchatbot"; // Import file db bạn đã làm
import { companyPolicies } from "@/dbchatbot/schema";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // 1. Tạo vector cho câu hỏi của người dùng
  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'), // Dùng model embedding của Google cho đồng bộ
    value: lastMessage,
  });

  // 2. Tìm trong Neon 3 đoạn chính sách liên quan nhất
  const relevantDocs = await db
    .select({ content: companyPolicies.content })
    .from(companyPolicies)
    .where(sql`1 - (${companyPolicies.embedding} <=> ${JSON.stringify(embedding)}) > 0.5`)
    .orderBy(sql`${companyPolicies.embedding} <=> ${JSON.stringify(embedding)}`)
    .limit(3);

  const context = relevantDocs.map(d => d.content).join("\n\n");

  // 3. Đưa bối cảnh vào System Prompt
  const result = await streamText({
    model: google('models/gemini-1.5-flash'),
    system: `Bạn là trợ lý nhân sự. Chỉ trả lời dựa trên thông tin chính sách sau: \n${context}\n Nếu không có trong thông tin, hãy lịch sự từ chối.`,
    messages,
  });

  return result.toDataStreamResponse();
}
*/


/*
import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/dbchatbot";
import { companyPolicies } from "@/dbchatbot/schema";
import { sql } from "drizzle-orm";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // 1. Lấy tin nhắn mới nhất của người dùng
  const lastMessage = messages[messages.length - 1].content;

  // 2. Chuyển câu hỏi thành Vector 768 chiều (Gemini)
  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'),
    value: lastMessage,
  });

  // 3. Tìm 3 đoạn văn bản có "khoảng cách trọng số" gần nhất trong Neon
  const relevantDocs = await db
    .select({ content: companyPolicies.content })
    .from(companyPolicies)
    .where(sql`1 - (${companyPolicies.embedding} <=> ${JSON.stringify(embedding)}) > 0.4`) // Ngưỡng chính xác 40%
    .orderBy(sql`${companyPolicies.embedding} <=> ${JSON.stringify(embedding)}`)
    .limit(3);

  // 4. Tạo ngữ cảnh (Context) từ dữ liệu tìm được
  const context = relevantDocs.length > 0 
    ? relevantDocs.map(d => d.content).join("\n\n")
    : "Không tìm thấy thông tin chính thức trong cơ sở dữ liệu.";

  // 5. Gửi cho Gemini kèm theo chỉ thị "Chỉ được dùng dữ liệu này"
  const result = await streamText({
    model: google('models/gemini-1.5-flash'),
    system: `Bạn là trợ lý nhân sự của công ty. 
    DỰA TRÊN THÔNG TIN CHÍNH SÁCH DƯỚI ĐÂY ĐỂ TRẢ LỜI:
    ---
    ${context}
    ---
    LƯU Ý: 
    - Nếu câu hỏi không có trong thông tin trên, hãy nói: "Tôi xin lỗi, thông tin này không có trong quy định hiện tại của công ty."
    - Trả lời ngắn gọn, chuyên nghiệp và dùng tiếng Việt.`,
    messages,
  });

  return result.toDataStreamResponse();
}
*/



import { streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from "@/dbchatbot";
import { companyPolicies } from "@/dbchatbot/schema";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // 1. Chuyển câu hỏi thành Vector
  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'),
    value: lastMessage,
  });

  // 2. Tìm trong Neon
  const relevantDocs = await db
    .select({ content: companyPolicies.content })
    .from(companyPolicies)
    .where(sql`1 - (${companyPolicies.embedding} <=> ${JSON.stringify(embedding)}) > 0.4`) // Ngưỡng 0.4
    .orderBy(sql`${companyPolicies.embedding} <=> ${JSON.stringify(embedding)}`)
    .limit(3);

  // --- BƯỚC QUAN TRỌNG: KIỂM TRA DỮ LIỆU ---
  let context = "";
  let systemInstruction = "";

  if (relevantDocs.length === 0) {
    // Nếu không có dữ liệu trong DB, ép AI trả lời theo kịch bản "Không thấy"
    systemInstruction = "Bạn là trợ lý nhân sự. Hiện tại trong cơ sở dữ liệu chính sách KHÔNG có thông tin này. Hãy trả lời rằng: 'Rất tiếc, tôi không tìm thấy quy định nào liên quan đến vấn đề này trong tài liệu chính sách của công ty.' và tuyệt đối không tự bịa ra câu trả lời.";
    
    // Nếu mảng rỗng, trả về một stream văn bản cố định luôn, không cần hỏi AI nữa
    //return new Response("Rất tiếc, ma trận dữ liệu hiện đang trống hoặc không tìm thấy chính sách nào phù hợp với câu hỏi của bạn.");

  } else {
    // Nếu có dữ liệu, cung cấp ngữ cảnh cho AI
    context = relevantDocs.map(d => d.content).join("\n\n");
    systemInstruction = `Bạn là trợ lý nhân sự. Hãy dựa vào thông tin chính sách sau đây để trả lời câu hỏi:
    ---
    ${context}
    ---
    Lưu ý: Chỉ trả lời dựa trên thông tin được cung cấp. Nếu thông tin không đủ để trả lời chắc chắn, hãy nói bạn không tìm thấy thông tin chính xác.`;
  }

  // 3. Gửi cho Gemini
  const result = await streamText({
    model: google('models/gemini-2.5-flash'),
    system: systemInstruction,
    messages,
  });

  return result.toDataStreamResponse();
}









