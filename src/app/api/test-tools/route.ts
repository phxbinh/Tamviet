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
    execute: async ({ city }) => {
      return `Thời tiết tại ${city} hôm nay đẹp, 28°C. (dữ liệu test)`;
    },
  }),
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model,
      system: 'Bạn là trợ lý hữu ích. Hãy sử dụng tool khi cần thông tin thời gian hoặc thời tiết.',
      messages,
      tools,
      toolChoice: 'auto',
      maxRetries: 3,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Có lỗi xảy ra khi xử lý yêu cầu' }),
      { status: 500 }
    );
  }
}