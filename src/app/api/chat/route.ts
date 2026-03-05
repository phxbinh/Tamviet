// app/api/chat/route.ts
/*
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-2.5-flash'), // ← sửa ở đây
      system: `Bạn là trợ lý AI thông minh, trả lời tự nhiên, hữu ích bằng tiếng Việt. Trả lời ngắn gọn nhưng đầy đủ.`,
      messages,
      // temperature: 0.7,   // thêm nếu muốn điều chỉnh độ sáng tạo
      // maxTokens: 2048,    // tùy chọn
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Lỗi ở /api/chat:', error);
    return new Response(
      JSON.stringify({ error: 'Lỗi khi gọi model' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
*/


// app/api/chat/route.ts
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('models/gemini-2.5-flash'),
    system:
      'Bạn là trợ lý AI thông minh, trả lời tự nhiên, hữu ích bằng tiếng Việt.',
    messages,
  });

  return result.toDataStreamResponse();
}

