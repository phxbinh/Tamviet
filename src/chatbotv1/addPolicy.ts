'use server';

import { db } from "./index";
import { companyPolicies } from "./schema";
import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { revalidatePath } from 'next/cache';

export async function addPolicyAction(formData: FormData) {
  const content = (formData.get('content') as string)?.trim() || '';
  const title = (formData.get('title') as string)?.trim() || '';
  const category = (formData.get('category') as string)?.trim() || 'Chung';
  const subCategory = (formData.get('subCategory') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);
  const documentId = formData.get('documentId') as string | null;

  if (!content || content.length < 10) {
    return { error: "Nội dung quá ngắn! (ít nhất 10 ký tự)" };
  }

  try {
    // 🔥 1. Generate embedding
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: content.replace(/\n/g, ' '),
    });

    // 🔥 2. Convert → pgvector format
    const embeddingString = `[${embedding.join(",")}]`;

    // 🔥 3. token estimate
    const tokenCount = Math.ceil(content.length / 4);

    // 🔥 4. Insert
    const result = await db.insert(companyPolicies).values({
      title: title || "Tài liệu không tiêu đề",
      content,

      documentId: documentId ?? null,

      chunkIndex: 0,
      tokenCount,

      category,
      subCategory,
      priority,
      isActive: true,

      // ✅ QUAN TRỌNG: cast sang vector
      embedding: embeddingString,

      metadata: {
        source: "Admin Panel",
        author: "System",
        wordCount: content.split(/\s+/).length,
      },
    }).returning({ id: companyPolicies.id });

    console.log("✅ Insert thành công, ID:", result[0]?.id);

    revalidatePath('/admin');

    return { success: "Đã lưu chính sách và đồng bộ vector thành công!" };

  } catch (error: any) {
    console.error("❌ Lỗi insert RAG:", error);

    return { 
      error: error.message?.includes('embedding') 
        ? "Lỗi tạo embedding từ Google AI." 
        : `Lỗi database: ${error.message}` 
    };
  }
}