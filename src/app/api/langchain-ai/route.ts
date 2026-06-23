// app/api/chat/route.ts
import { LangChainAdapter } from '@ai-sdk/langchain';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // Quan trọng: LangChain thường không chạy tốt trên Edge

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash", // hoặc gemini-2.5-pro
    temperature: 0.7,
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  // Ví dụ một chain đơn giản với LangChain
  const prompt = PromptTemplate.fromTemplate(
    `Bạn là trợ lý hữu ích. Trả lời bằng tiếng Việt.\n\n{input}`
  );

  const chain = RunnableSequence.from([
    prompt,
    model,
  ]);

  const stream = await chain.stream({
    input: messages[messages.length - 1].content,
  });

  // Convert LangChain stream sang Vercel AI SDK stream
  return LangChainAdapter.toDataStreamResponse(stream);
}