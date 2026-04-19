'use server';

import { db } from "./index";
import { companyPolicies } from "./schema";
import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { revalidatePath } from 'next/cache';

export async function addPolicyAction(formData: FormData) {
  const content = formData.get('content') as string;
  const metadata = formData.get('metadata') as string || "Chính sách chung";

  if (!content || content.trim().length < 10) {
    return { error: "Nội dung quá ngắn!" };
  }

  try {
    // Generate embedding với model mới
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: content.replace(/\n/g, ' ').trim(),
    });

    // Insert
    const result = await db.insert(companyPolicies).values({
      content,
      embedding: embedding as any,        // hoặc better typing nếu bạn define
      metadata,
    }).returning({ id: companyPolicies.id });

    console.log("✅ Insert thành công, ID:", result[0]?.id);

    revalidatePath('/admin');
    return { success: "Đã lưu chính sách thành công!" };

  } catch (error: any) {
    console.error("❌ Lỗi insert:", error);
    console.error("Chi tiết:", error.message, error.stack);
    
    // Trả lỗi chi tiết hơn cho debug
    return { 
      error: error.message?.includes('embedding') 
        ? "Lỗi tạo embedding - kiểm tra API key và model" 
        : `Lỗi database: ${error.message}` 
    };
  }
}