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
