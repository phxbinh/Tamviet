// app/api/langchain-ai/route.ts
/*
import { toUIMessageStream } from '@ai-sdk/langchain';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { NextRequest } from 'next/server';
import { createUIMessageStreamResponse } from 'ai';   // hoặc toDataStreamResponse nếu cần

export const runtime = 'nodejs';   // Rất quan trọng khi dùng LangChain

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-2.5-flash",
      temperature: 0.7,
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const prompt = PromptTemplate.fromTemplate(
      `Bạn là trợ lý hữu ích. Trả lời bằng tiếng Việt.\n\n{input}`
    );

    const chain = RunnableSequence.from([prompt, model]);

    const stream = await chain.stream({
      input: messages[messages.length - 1]?.content || "",
    });

    // Convert LangChain stream → Vercel AI stream
    const uiStream = toUIMessageStream(stream);

    return createUIMessageStreamResponse(uiStream);
    // Hoặc thử: return toDataStreamResponse(uiStream); nếu bạn import được

  } catch (error) {
    console.error(error);
    return new Response("Lỗi server", { status: 500 });
  }
}
*/

// app/api/langchain-ai/route.ts
/*
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { NextRequest } from 'next/server';
import { createDataStreamResponse } from 'ai';   // ← Dùng cái này

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Convert messages Vercel → LangChain
    const langchainMessages = await toBaseMessages(messages);

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.7,
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const prompt = PromptTemplate.fromTemplate(
      `Bạn là trợ lý hữu ích. Trả lời bằng tiếng Việt một cách tự nhiên.\n\n{input}`
    );

    const chain = RunnableSequence.from([prompt, model]);

    const lastInput = langchainMessages[langchainMessages.length - 1]?.content || "";

    const stream = await chain.stream({ input: lastInput });

    const uiStream = toUIMessageStream(stream);

    return createDataStreamResponse({
      stream: uiStream,
    });

  } catch (error) {
    console.error("LangChain Error:", error);
    return new Response("Có lỗi xảy ra. Vui lòng thử lại.", { status: 500 });
  }
}
*/
/* Error 
Failed to compile.
15:05:22 
15:05:22 
./src/app/api/langchain-ai/route.ts:82:7
15:05:22 
Type error: Object literal may only specify known properties, and 'stream' does not exist in type 'ResponseInit & { execute: (dataStream: DataStreamWriter) => void | Promise<void>; onError?: ((error: unknown) => string) | undefined; }'.
15:05:22 
15:05:22 
  80 |
15:05:22 
  81 |     return createDataStreamResponse({
15:05:22 
> 82 |       stream: uiStream,
15:05:22 
     |       ^
15:05:22 
  83 |     });
15:05:22 
  84 |
15:05:22 
  85 |   } catch (error) {
15:05:22 
Next.js build worker exited with code: 1 and signal: null
15:05:22 
Error: Command "npm run build" exited with 1


*/






// src/app/api/langchain-ai/route.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.7,
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    });

    const prompt = PromptTemplate.fromTemplate(
      `Bạn là trợ lý hữu ích. Trả lời bằng tiếng Việt tự nhiên, ngắn gọn.\n\n{input}`
    );

    const chain = RunnableSequence.from([prompt, model]);

    const lastMessage = messages[messages.length - 1]?.content || "";

    const stream = await chain.stream({ input: lastMessage });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = typeof chunk === 'string' 
              ? chunk 
              : chunk?.content || chunk?.text || "";

            if (text) {
              // Format đúng cho Vercel AI SDK useChat
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'text-delta', content: text })}\n\n`)
              );
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Lỗi server" }),
      { status: 500 }
    );
  }
}



