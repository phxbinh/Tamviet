// app/api/chat/route.ts
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60; // cho response dài

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-2.0-flash-001'), // hoặc gemini-2.0-pro-exp, claude-...
    system: `Bạn là trợ lý AI thông minh, trả lời tự nhiên, hữu ích bằng tiếng Việt. Trả lời ngắn gọn nhưng đầy đủ.`,
    messages,
  });

  return result.toDataStreamResponse();
}