// app/api/agent/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

/*
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
    system: 'Bạn là một trợ lý tài chính thông minh. Khi người dùng hỏi về giá cả của các tài sản (vàng, dầu...), hãy luôn sử dụng các công cụ tương ứng để lấy dữ liệu thực tế và đưa ra câu trả lời ngắn gọn kèm biểu diễn dữ liệu.',
    maxSteps: 3, 
    tools: {
      // Công cụ lấy dữ liệu tài sản để render UI
      getAssetData: {
        description: 'Lấy dữ liệu chi tiết hiện tại và lịch sử của một tài sản tài chính (ví dụ: XAUUSD, UKOIL).',
        parameters: z.object({
          pair: z.string().describe('Mã cặp tỷ giá hoặc tài sản, ví dụ: XAUUSD, UKOIL'),
        }),
        execute: async ({ pair }) => {
          const upperPair = pair.toUpperCase();
          
          if (upperPair === 'XAUUSD') {
            return {
              type: 'financial_card',
              name: 'Vàng ròng (Gold Spot / US Dollar)',
              code: 'XAUUSD',
              price: 2350.5,
              change: 1.25, // Tăng 1.25%
              sparkline: [2330, 2342, 2338, 2345, 2350.5], // Dữ liệu tượng trưng để vẽ biểu đồ mini
              lastUpdated: new Date().toLocaleTimeString('vi-VN')
            };
          }
          
          if (upperPair === 'UKOIL' || upperPair === 'OIL') {
            return {
              type: 'financial_card',
              name: 'Dầu Thô Brent (Brent Crude Oil)',
              code: 'UKOIL',
              price: 82.3,
              change: -0.45, // Giảm 0.45%
              sparkline: [83.1, 82.9, 82.6, 82.1, 82.3],
              lastUpdated: new Date().toLocaleTimeString('vi-VN')
            };
          }

          return { error: `Không tìm thấy dữ liệu cho cặp ${pair}.` };
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
*/

// app/api/agent/route.ts
// ... giữ nguyên các phần import ...

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
    system: 'Bạn là một trợ lý tài chính thông minh...',
    maxSteps: 3, 
    tools: {
      getAssetData: {
        description: 'Lấy dữ liệu chi tiết hiện tại của một tài sản tài chính (ví dụ: XAUUSD).',
        parameters: z.object({
          pair: z.string().describe('Mã cặp tỷ giá hoặc tài sản, ví dụ: XAUUSD'),
        }),
        execute: async ({ pair }) => {
          const upperPair = pair.toUpperCase();
          
          if (upperPair === 'XAUUSD') {
            try {
              // Gọi đến một API cập nhật giá vàng thực tế (Ví dụ dùng GoldAPI.io)
              // Bạn cần đăng ký một API key miễn phí từ các service này để bỏ vào .env
              const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
                headers: {
                  'x-access-token': process.env.GOLD_API_KEY || '',
                  'Content-Type': 'application/json'
                }
              });
              
              if (!response.ok) throw new Error('Không thể kết nối API giá vàng');
              
              const data = await response.json();
              
              // data trả về từ GoldAPI thường có cấu trúc: { price: ..., chg_pct: ..., ... }
              return {
                type: 'financial_card',
                name: 'Vàng thế giới (Gold Spot / US Dollar)',
                code: 'XAUUSD',
                price: data.price, // Giá realtime 2026 từ API
                change: data.chg_pct, // Phần trăm thay đổi trong ngày từ API
                sparkline: [data.open, data.low, data.high, data.price], // Biến động từ mở cửa đến hiện tại
                lastUpdated: new Date().toLocaleTimeString('vi-VN')
              };
            } catch (error) {
              console.error('Lỗi khi fetch giá vàng thực tế:', error);
              // Fallback hoặc báo lỗi nếu API sập
              return { error: 'Hệ thống không thể lấy giá vàng realtime lúc này. Vui lòng thử lại sau.' };
            }
          }
          
          return { error: `Không tìm thấy dữ liệu cho cặp ${pair}.` };
        },
      },
    },
  });

  return result.toDataStreamResponse();
}


