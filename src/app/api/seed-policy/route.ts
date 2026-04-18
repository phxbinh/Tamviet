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





