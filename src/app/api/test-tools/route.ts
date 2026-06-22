import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const model = google('gemini-2.5-pro'); // thử gemini-2.5-pro nếu vẫn lỗi

const tools = {
  getCurrentTime: tool({
    description: 'Lấy thời gian hiện tại',
    parameters: z.object({}),
    execute: async () => {
      const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      return `Thời gian hiện tại tại Việt Nam: ${now}`;
    },
  }),

  getWeather: tool({
    description: 'Lấy thông tin thời tiết',
    parameters: z.object({
      city: z.string().describe('Tên thành phố, ví dụ: Hà Nội'),
    }),
    execute: async ({ city }) => {
      return `Thời tiết tại ${city} hôm nay đẹp, khoảng 28°C (dữ liệu test).`;
    },
  }),
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model,
      system: 'Bạn là trợ lý hữu ích. Trả lời bằng tiếng Việt tự nhiên. Khi cần thông tin, hãy dùng tool rồi sau đó đưa ra câu trả lời rõ ràng cho người dùng.',
      messages,
      tools,
      toolChoice: 'auto',
      maxSteps: 5,           // ← Quan trọng nhất! 
      maxRetries: 3,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(
      `data: ${JSON.stringify({ error: error.message || 'Lỗi server' })}\n\n`,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/event-stream' } 
      }
    );
  }
}