/*
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
      model: google.embedding('text-embedding-04'), 
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

*/



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
    return { error: "Nội dung quá ngắn!" };
  }

  try {
    // SỬA Ở ĐÂY: Dùng ID model chuẩn của Google SDK
    const { embedding } = await embed({
      model: google.embedding('text-embedding-04'), 
      value: content.replace(/\n/g, ' '), 
    });

    // Thực hiện Insert
    const result = await db.insert(companyPolicies).values({
      content,
      embedding: embedding as any, 
      metadata: metadata || "Chính sách chung",
    }).returning({ id: companyPolicies.id }); // Trả về ID để xác nhận thành công

    console.log("Insert thành công ID:", result[0].id);

    revalidatePath('/admin'); 
    return { success: "Đã lưu thành công!" };
  } catch (error: any) {
    // Log chi tiết lỗi ra console để debug
    console.error("LỖI CHI TIẾT:", error.message);
    return { error: `Lỗi: ${error.message}` };
  }
}


