import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Khởi tạo model Gemini (dùng 2.5-flash hoặc 2.5-pro)
const model = google('gemini-2.5-flash');   // hoặc gemini-2.5-pro

// === Định nghĩa các Tool đơn giản để test ===
const tools = {
  getCurrentTime: tool({
    description: 'Lấy thời gian hiện tại',
    parameters: z.object({}), // không cần tham số
    execute: async () => {
      const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      return `Thời gian hiện tại tại Việt Nam: ${now}`;
    },
  }),

  getWeather: tool({
    description: 'Lấy thông tin thời tiết tại một thành phố',
    parameters: z.object({
      city: z.string().describe('Tên thành phố, ví dụ: Hà Nội, TP.HCM, Đà Nẵng'),
    }),
    execute: async ({ city }) => {
      // Fake data để test
      const weathers = ['Nắng đẹp', 'Mưa nhẹ', 'Có mây', 'Nóng bức', 'Mát mẻ'];
      const temp = Math.floor(Math.random() * 15) + 20;
      return `Thời tiết tại ${city}: ${weathers[Math.floor(Math.random()*weathers.length)]}, nhiệt độ khoảng ${temp}°C.`;
    },
  }),

  searchInfo: tool({
    description: 'Tìm kiếm thông tin đơn giản',
    parameters: z.object({
      query: z.string().describe('Từ khóa cần tìm'),
    }),
    execute: async ({ query }) => {
      return `Kết quả tìm kiếm cho "${query}": Đây là thông tin mẫu trả về từ tool. Trong thực tế bạn có thể gọi API bên ngoài.`;
    },
  }),
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model,
    system: 'Bạn là một AI hữu ích. Khi người dùng yêu cầu thông tin về thời gian, thời tiết, hoặc tìm kiếm, hãy sử dụng tool tương ứng.',
    messages,
    tools,
    toolChoice: 'auto',        // hoặc 'required' để bắt buộc gọi tool
    maxRetries: 3,
  });

  return result.toDataStreamResponse();
}