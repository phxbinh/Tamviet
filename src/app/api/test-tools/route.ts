import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const model = google('gemini-2.5-flash'); // thử gemini-2.5-pro nếu vẫn lỗi

/*
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
*/
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
    description: 'Lấy thông tin thời tiết hiện tại và dự báo ngắn hạn',
    parameters: z.object({
      city: z.string().describe('Tên thành phố, ví dụ: Hà Nội, Hồ Chí Minh, Đà Nẵng'),
    }),
    execute: async ({ city }) => {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          return `Không tìm thấy thông tin thời tiết cho thành phố "${city}".`;
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
          `&timezone=Asia/Ho_Chi_Minh`
        );

        const weatherData = await weatherRes.json();
        const current = weatherData.current;
        const daily = weatherData.daily;

        // Weather code map với index signature
        const weatherCodeMap: { [key: number]: string } = {
          0: "Trời quang",
          1: "Chủ yếu quang",
          2: "Có mây",
          3: "Mây u ám",
          45: "Sương mù",
          51: "Mưa phùn nhẹ",
          61: "Mưa nhẹ",
          63: "Mưa vừa",
          65: "Mưa to",
          71: "Tuyết nhẹ",
          80: "Mưa rào",
          95: "Giông",
        };

        const code = Number(current.weather_code);
        const description = weatherCodeMap[code] || "Thời tiết thay đổi";

        return `
**Thời tiết tại ${name} (${city})**

🌡️ Nhiệt độ hiện tại: **${current.temperature_2m}°C**
☁️ Cảm giác như: ${current.apparent_temperature}°C
💧 Độ ẩm: ${current.relative_humidity_2m}%
🌬️ Gió: ${current.wind_speed_10m} km/h
⛅ Trạng thái: ${description}

**Dự báo:**
- Ngày mai: ${daily.temperature_2m_max[1]}°C / ${daily.temperature_2m_min[1]}°C
- Ngày kia: ${daily.temperature_2m_max[2]}°C / ${daily.temperature_2m_min[2]}°C
        `.trim();
      } catch (error) {
        console.error(error);
        return `Có lỗi khi lấy dữ liệu thời tiết cho "${city}". Vui lòng thử lại sau.`;
      }
    },
  }),
};






export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model,
      //system: 'Bạn là trợ lý hữu ích. Trả lời bằng tiếng Việt tự nhiên. Khi cần thông tin, hãy dùng tool rồi sau đó đưa ra câu trả lời rõ ràng cho người dùng.',
      system: `
Bạn là trợ lý hữu ích.
Luôn trả lời bằng tiếng Việt.

Khi cần dùng tool:
- Phải gọi tool để lấy dữ liệu.
- Sau khi nhận kết quả tool, BẮT BUỘC tạo câu trả lời cuối cùng cho người dùng.
- Không được kết thúc sau tool result.
- Luôn phản hồi bằng văn bản tự nhiên.
`,
      messages,
      tools,
      toolChoice: 'auto',
      maxSteps: 10,           // ← Quan trọng nhất! 
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