import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const model = google('gemini-2.5-flash');

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
      city: z.string().describe('Tên thành phố'),
    }),
    execute: async ({ city }) => `Thời tiết tại ${city} hôm nay đẹp, 28°C (test).`,
  }),
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model,
      system: 'Bạn là trợ lý hữu ích. Luôn trả lời bằng tiếng Việt. Khi cần dùng tool thì dùng, sau đó trả lời rõ ràng cho người dùng.',
      messages,
      tools,
      toolChoice: 'auto',
      maxRetries: 3,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(
      `data: ${JSON.stringify({ error: error.message })}\n\n`,
      { headers: { 'Content-Type': 'text/event-stream' } }
    );
  }
}