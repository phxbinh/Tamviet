'use server';

import { db } from "./index";
import { companyPolicies } from "./schema";
import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';

//export 
async function addPolicyAction_(formData: FormData) {
  // Lấy dữ liệu từ Form
  const content = formData.get('content') as string;
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const subCategory = formData.get('subCategory') as string;
  const priority = parseInt(formData.get('priority') as string || "0");
  const documentId = formData.get('documentId') as string; // UUID nhóm tài liệu

  // Kiểm tra đầu vào
  if (!content || content.trim().length < 10) {
    return { error: "Nội dung quá ngắn!" };
  }

  try {
    // 1. Generate embedding (Gemini-embedding-001 hoặc text-embedding-3-large)
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: content.replace(/\n/g, ' ').trim(),
    });

    // 2. Insert vào Database với đầy đủ Metadata
    const result = await db.insert(companyPolicies).values({
      title: title || "Tài liệu không tiêu đề",
      content: content,
      documentId: documentId || undefined,
      
      // Phân loại rõ ràng giúp lọc nhanh
      category: category || "Chung",
      subCategory: subCategory || null,
      priority: priority,
      isActive: true,

      // Vector Embedding
      embedding: embedding,

      // Tự động tạo tsvector cho Full-text search (SQL Raw)
      // Chú ý: Drizzle hỗ trợ sql template để gán giá trị cho cột tsvector
      contentTsv: sql`to_tsvector('vietnamese', ${content})`,

      // Các thông tin bổ sung lưu vào JSONB
      metadata: {
        source: "Admin Panel",
        author: "System",
        wordCount: content.split(/\s+/).length
      },
    }).returning({ id: companyPolicies.id });

    console.log("✅ Insert thành công với Metadata, ID:", result[0]?.id);

    revalidatePath('/admin');
    return { success: "Đã lưu chính sách và đồng bộ vector thành công!" };

  } catch (error: any) {
    console.error("❌ Lỗi insert RAG:", error);
    
    return { 
      error: error.message?.includes('embedding') 
        ? "Lỗi API AI: Không thể tạo vector." 
        : `Lỗi Database: ${error.message}` 
    };
  }
}




export async function addPolicyAction(formData: FormData) {
  // Trích xuất dữ liệu từ formData
  const content = formData.get('content') as string;
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const priority = parseInt(formData.get('priority') as string || "0");
  const documentId = formData.get('documentId') as string;

  // Validation cơ bản
  if (!content || content.trim().length < 10) {
    return { error: "Nội dung quá ngắn!" };
  }

  try {
    // 1. Tạo Embedding
    const { embedding } = await embed({
      model: google.embedding('gemini-embedding-001'),
      value: content.trim(),
    });

    // 2. Thực hiện Insert
    const result = await db.insert(companyPolicies).values({
      // Các trường định danh và nội dung
      title: title || "Chính sách không tiêu đề",
      content: content.trim(),
      documentId: documentId || null, // UUID cần null nếu không có giá trị

      // FIX LỖI: Cung cấp các giá trị bắt buộc mà TypeScript yêu cầu
      chunkIndex: 0, // Bạn có thể logic hóa số này nếu cắt nhỏ file
      tokenCount: content.split(/\s+/).length, // Ước tính sơ bộ

      // Vector Embedding (Ép kiểu as any nếu Drizzle chưa nhận diện vector type)
      embedding: embedding as any,

      // Metadata & Phân loại
      category: category || "General",
      subCategory: null,
      isActive: true,
      priority: priority,

      // Full-text Search: Đồng bộ hóa tsvector ngay khi insert
      contentTsv: sql`to_tsvector('vietnamese', ${content})`,

      // JSONB metadata
      metadata: {
        source: "Admin Dashboard",
        timestamp: new Date().toISOString()
      },
    }).returning({ id: companyPolicies.id });

    revalidatePath('/admin');
    return { success: "Đã nạp dữ liệu thành công!", id: result[0].id };

  } catch (error: any) {
    console.error("Lỗi nạp chính sách:", error);
    return { error: `Lỗi hệ thống: ${error.message}` };
  }
}





