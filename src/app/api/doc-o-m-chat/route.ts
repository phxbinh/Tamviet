// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { z } from 'zod';
import { db } from '@/dbchatbot'; // Import instance Drizzle của bạn
import { assets, documents, documentSections, documentChunks } from '@/chatbot_OM/schemas';
import { eq, like, sql, and } from 'drizzle-orm';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
    maxSteps: 3, // Cho phép Agent thực hiện chuỗi tư duy (Ví dụ: Tra tài sản trước -> Tìm tài liệu sau)
    system: `Bạn là kỹ sư trợ lý vận hành và bảo trì (O&M) thông minh. 
    Nhiệm vụ của bạn là hỗ trợ kỹ thuật viên tra cứu quy trình vận hành, tài liệu kỹ thuật, thông tin thiết bị và xử lý sự cố.
    Hãy luôn sử dụng các công cụ được cung cấp để lấy thông tin chính xác từ hệ thống cơ sở dữ liệu tri thức trước khi trả lời.
    Nếu tài liệu không đề cập, hãy thông báo rằng hệ thống dữ liệu hiện tại chưa cập nhật quy trình đó, tuyệt đối không tự bịa thông số kỹ thuật.`,
    
    tools: {
      // TOOL 1: Tra cứu thông tin thiết bị hoặc quy trình (Metadata & Code)
      searchAssets: {
        description: 'Dùng khi user muốn tra cứu danh sách hoặc thông tin tổng quan của thiết bị, hóa chất, dụng cụ hoặc quy trình dựa trên tên hoặc mã code.',
        parameters: z.object({
          keyword: z.string().describe('Từ khóa tên thiết bị hoặc quy trình (ví dụ: máy bơm, bể aerotank, clo)'),
          assetType: z.enum(['process', 'equipment', 'chemical', 'instrument', 'safety', 'maintenance']).optional().describe('Lọc theo phân loại tài sản nếu có')
        }),
        execute: async ({ keyword, assetType }) => {
          try {
            const conditions = [like(assets.name, `%${keyword}%`)];
            if (assetType) {
              conditions.push(eq(assets.assetType, assetType));
            }

            const rows = await db
              .select()
              .from(assets)
              .where(and(...conditions))
              .limit(5);

            return { success: true, type: 'asset_results', data: rows };
          } catch (error: any) {
            return { error: `Lỗi tra cứu thiết bị: ${error.message}` };
          }
        }
      },

      // TOOL 2: Tìm kiếm ngữ cảnh sâu bằng Vector (RAG Core)
      searchKnowledgeBase: {
        description: 'Dùng khi cần tìm câu trả lời chi tiết liên quan đến quy trình vận hành, hướng dẫn bảo trì, xử lý sự cố kỹ thuật hoặc thông số cụ thể.',
        parameters: z.object({
          query: z.string().describe('Câu hỏi hoặc nội dung kỹ thuật cần tìm kiếm ngữ cảnh tương đồng'),
          limit: z.number().default(4).describe('Số lượng đoạn văn bản cần lấy')
        }),
        execute: async ({ query, limit }) => {
          try {
            // 1. Tạo vector 3072 chiều từ câu hỏi của người dùng bằng Gemini Embedding API
            const { embedding } = await embed({
              model: google.embedding('text-embedding-004', {
                outputDimensionality: 3072, // Ép model sinh ra đúng 3072 chiều để khớp hoàn hảo với DB của bạn
              }),
              value: query,
            });

            // 2. Thực hiện truy vấn khoảng cách Cosine trên PostgreSQL với pgvector
            // Sử dụng toán tử <=> đại diện cho Cosine Distance
            const similarity = sql`1 - (${documentChunks.embedding} <=> ${JSON.stringify(embedding)}::vector)`;

            const hits = await db
              .select({
                id: documentChunks.id,
                sectionPath: documentChunks.sectionPath,
                content: documentChunks.content,
                score: similarity,
                // Lấy kèm thông tin tên tài liệu và thiết bị để Agent tăng độ hiểu biết ngữ cảnh
                documentTitle: documents.title,
                assetName: assets.name
              })
              .from(documentChunks)
              .innerJoin(documents, eq(documentChunks.documentId, documents.id))
              .innerJoin(assets, eq(documents.assetId, assets.id))
              .where(sql`${similarity} > 0.4`) // Ngưỡng điểm tin cậy, tránh lấy rác dữ liệu
              .orderBy(sql`${documentChunks.embedding} <=> ${JSON.stringify(embedding)}::vector`)
              .limit(limit);

            return { success: true, type: 'vector_rag_results', chunks: hits };
          } catch (error: any) {
            return { error: `Lỗi tìm kiếm Vector tri thức: ${error.message}` };
          }
        }
      },

      // TOOL 3: Đọc chi tiết một Section (Chương/Mục) cụ thể
      getSectionDetails: {
        description: 'Dùng khi kỹ thuật viên muốn đọc trọn vẹn nội dung, summary, keywords hoặc intent_tags của một phân mục tài liệu cụ thể dựa trên ID.',
        parameters: z.object({
          sectionId: z.string().describe('UUID của chương/mục tài liệu')
        }),
        execute: async ({ sectionId }) => {
          try {
            const section = await db
              .select()
              .from(documentSections)
              .where(eq(documentSections.id, sectionId))
              .limit(1);

            if (section.length === 0) return { error: 'Không tìm thấy chương mục tài liệu này.' };
            return { success: true, type: 'section_detail', data: section[0] };
          } catch (error: any) {
            return { error: `Lỗi lấy chi tiết mục: ${error.message}` };
          }
        }
      }
    }
  });

  return result.toDataStreamResponse();
}
