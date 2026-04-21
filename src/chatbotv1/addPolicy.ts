/* Đang chạy được
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
    //const embeddingString = `[${embedding.join(",")}]`;

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
      embedding: embedding,

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
*/

// Bản test cho document_id và chunk_index
'use server';

import { db } from "./index";
import { companyPolicies } from "./schema";
import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { revalidatePath } from 'next/cache';

function chunkText(text: string, size = 800, overlap = 150) {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size - overlap;
  }

  return chunks;
}

function chunkWithOverlap(text: string, maxLength = 500, overlap = 100) {
  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks: string[] = [];

  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      chunks.push(current.trim());

      // overlap
      current = current.slice(-overlap) + " " + sentence;
    } else {
      current += " " + sentence;
    }
  }

  if (current) chunks.push(current.trim());

  return chunks;
}





export async function addPolicyAction(formData: FormData) {
  const content = (formData.get('content') as string)?.trim() || '';
  const title = (formData.get('title') as string)?.trim() || '';
  const category = (formData.get('category') as string)?.trim() || 'Chung';
  const subCategory = (formData.get('subCategory') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  if (!content || content.length < 20) {
    return { error: "Nội dung quá ngắn!" };
  }

  try {
    // ✅ 1. Tạo document_id cho policy này
    const documentId = crypto.randomUUID();

    // ✅ 2. Chunk
    //const chunks = chunkText(content);
    const chunks = chunkWithOverlap(content);

    // ❗ tránh tài liệu quá dài
    if (chunks.length > 50) {
      return { error: "Tài liệu quá dài, hãy chia nhỏ." };
    }

    // ✅ 3. Embed song song (NHANH)
    const embeddings = await Promise.all(
      chunks.map(chunk =>
        embed({
          model: google.embedding('gemini-embedding-001'),
          value: chunk.replace(/\n/g, ' '),
        })
      )
    );

    // ✅ 4. Build rows
    const rows = chunks.map((chunk, i) => ({
      title: title || "Tài liệu không tiêu đề",
      content: chunk,

      documentId,
      chunkIndex: i,

      tokenCount: Math.ceil(chunk.length / 4),

      category,
      subCategory,
      priority,
      isActive: true,

      embedding: embeddings[i].embedding,

      metadata: {
        source: "Admin",
        wordCount: chunk.split(/\s+/).length,
      },
    }));

    // ✅ 5. Insert batch
    await db.insert(companyPolicies).values(rows);

    revalidatePath('/admin');

    return { success: `Đã lưu ${rows.length} chunks` };

  } catch (error: any) {
    console.error("❌ Insert error:", error);

    return {
      error: error.message?.includes('embedding')
        ? "Lỗi embedding"
        : error.message
    };
  }
}









