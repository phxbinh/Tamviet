'use server';

import { db } from "./index";
import { companyPolicies } from "./schema";
import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';

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
    // Generate embedding
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: content.replace(/\n/g, ' '),
    });

    // Tính tokenCount đơn giản (ước lượng)
    const tokenCount = Math.ceil(content.length / 4); // rough estimate

    const result = await db.insert(companyPolicies).values({
      title: title || "Tài liệu không tiêu đề",
      content,
      documentId: documentId || undefined,

      chunkIndex: 0,           // nếu không chunk thì = 0
      tokenCount,

      category,
      subCategory,
      priority,
      isActive: true,

      embedding,

      // Không cần insert contentTsv nữa nếu dùng generated column
      // Nếu vẫn muốn insert thủ công thì giữ dòng cũ:
      // contentTsv: sql`to_tsvector('vietnamese', ${content})`,

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