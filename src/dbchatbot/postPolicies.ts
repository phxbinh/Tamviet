'use server';

import { db } from "./index";
import { companyPolicies } from "./schema";
import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { revalidatePath } from 'next/cache';

export async function addPolicyAction(formData: FormData) {
  const content = formData.get('content') as string;
  const metadata = formData.get('metadata') as string;

  if (!content || content.trim().length < 10) {
    return { error: "Nội dung quá ngắn hoặc trống!" };
  }

  try {
    // 1. Tạo Vector 768 chiều từ Gemini
    const { embedding } = await embed({
      model: google.embedding('text-embedding-004'), 
      value: content.replace(/\n/g, ' '), 
    });

    // 2. Lưu vào Neon
    await db.insert(companyPolicies).values({
      content,
      embedding: embedding as any, 
      metadata: metadata || "Chính sách chung",
    });

    revalidatePath('/admin'); 
    return { success: "Đã nạp dữ liệu vào ma trận 768 chiều thành công!" };
  } catch (error) {
    console.error("Lỗi:", error);
    return { error: "Không thể lưu dữ liệu. Kiểm tra lại kết nối Neon." };
  }
}
