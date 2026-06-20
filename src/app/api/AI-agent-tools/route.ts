/*
// app/api/agent/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

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

/*
// app/api/agent/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

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

*/

// app/api/AI-agent-tools/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
    system: 'Bạn là một trợ lý tài chính thông minh. Hãy luôn dùng công cụ getAssetData để lấy dữ liệu.',
    maxSteps: 3,
    tools: {
      getAssetData: {
        description: 'Lấy dữ liệu chi tiết hiện tại của một tài sản bất kỳ như XAUUSD, UKOIL, BTCUSD, ETHUSD.',
        parameters: z.object({
          pair: z.string().describe('Mã cặp tài sản, ví dụ: XAUUSD, BTCUSD'),
        }),
        execute: async ({ pair }) => {
          const symbol = pair.toUpperCase().trim();
          
          try {
            // 1. NHÓM VÀNG (GoldAPI)
            if (symbol === 'XAUUSD' || symbol === 'XAGUSD') {
              const metal = symbol.substring(0, 3);
              const res = await fetch(`https://www.goldapi.io/api/${metal}/USD`, {
                headers: { 'x-access-token': process.env.GOLD_API_KEY || '' }
              });
              const data = await res.json();
              
              // Kiểm tra xem GoldAPI có trả về lỗi hệ thống không
              if (data.error || !data.price) {
                return { error: data.error || 'Không thể lấy dữ liệu từ GoldAPI. Vui lòng kiểm tra lại API Key.' };
              }

              return {
                type: 'financial_card',
                category: 'metal',
                name: symbol === 'XAUUSD' ? 'Vàng Thế Giới' : 'Bạc Thế Giới',
                code: symbol,
                price: Number(data.price),
                change: Number(data.chg_pct || 0),
                sparkline: [Number(data.open || data.price), Number(data.low || data.price), Number(data.high || data.price), Number(data.price)],
                lastUpdated: new Date().toLocaleTimeString('vi-VN')
              };
            }

            // 2. NHÓM CRYPTO (Binance
/*
            if (symbol.endsWith('USDT') || symbol === 'BTCUSD' || symbol === 'ETHUSD' || symbol === 'SOLUSD') {
              const binanceSymbol = symbol.replace('USD', 'USDT');
              const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`);
              
              if (!res.ok) return { error: `Mã ${binanceSymbol} không tồn tại trên sàn Binance.` };
              const data = await res.json();

              return {
                type: 'financial_card',
                category: 'crypto',
                name: symbol.startsWith('BTC') ? 'Bitcoin' : symbol.startsWith('ETH') ? 'Ethereum' : 'Crypto Asset',
                code: symbol,
                price: Number(data.lastPrice || 0),
                change: Number(data.priceChangePercent || 0),
                sparkline: [Number(data.openPrice || 0), Number(data.lowPrice || 0), Number(data.highPrice || 0), Number(data.lastPrice || 0)],
                lastUpdated: new Date().toLocaleTimeString('vi-VN')
              };
            }
*/
// 2. NHÓM CRYPTO (Binance)
if (symbol.endsWith('USDT') || symbol === 'BTCUSD' || symbol === 'ETHUSD' || symbol === 'SOLUSD') {
  
  // Giải pháp an toàn: Nếu chuỗi đã chứa 'USDT' thì giữ nguyên, ngược lại mới chuyển 'USD' thành 'USDT'
  const binanceSymbol = symbol.includes('USDT') 
    ? symbol 
    : symbol.replace('USD', 'USDT');
  
  // Gọi API với mã đã được làm sạch chuẩn mã sàn Binance
  const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`);
  
  if (!res.ok) {
    return { error: `Mã ${binanceSymbol} không khớp hoặc không tồn tại trên sàn Binance.` };
  }
  
  const data = await res.json();

  // Đổi tên hiển thị cho đẹp dựa trên mã gốc
  const displayName = binanceSymbol.startsWith('BTC') 
    ? 'Bitcoin' 
    : binanceSymbol.startsWith('ETH') 
    ? 'Ethereum' 
    : 'Crypto Asset';

  return {
    type: 'financial_card',
    category: 'crypto',
    name: displayName,
    code: symbol.includes('USDT') ? symbol : `${symbol}T`, // Đồng bộ hiển thị dạng BTCUSDT trên UI
    price: Number(data.lastPrice || 0),
    change: Number(data.priceChangePercent || 0),
    sparkline: [
      Number(data.openPrice || 0), 
      Number(data.lowPrice || 0), 
      Number(data.highPrice || 0), 
      Number(data.lastPrice || 0)
    ],
    lastUpdated: new Date().toLocaleTimeString('vi-VN')
  };
}




            // Fallback cho các mã khác
            return { error: `Hệ thống chưa hỗ trợ cấu trúc dữ liệu cho mã: ${symbol}` };

          } catch (e) {
            return { error: 'Lỗi kết nối máy chủ dữ liệu.' };
          }
        },
      },
    },
  });

  return result.toDataStreamResponse();
}


