// app/api/langchain-ai/route.ts
/*
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const model =
      new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.7,
      });

    const chatHistory = messages.map(
      (msg: any) => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        }

        return new AIMessage(msg.content);
      }
    );

    const stream =
      await model.stream(chatHistory);

    const encoder =
      new TextEncoder();

    const readable =
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            controller.enqueue(
              encoder.encode(
                chunk.content.toString()
              )
            );
          }

          controller.close();
        },
      });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Chat failed",
      },
      {
        status: 500,
      }
    );
  }
}
//*/


/*
// Gemini ->spaw
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
// 1. Gom toàn bộ xuất bản của package vào thực thể LangChainAdapter
import * as LangChainAdapter from "@ai-sdk/langchain";
// 2. Nhập hàm tạo Response từ package lõi 'ai'
import { createDataStreamResponse } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    });

    const chatHistory = messages.map((msg: any) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });

    // Gọi stream từ LangChain như bình thường
    const stream = await model.stream(chatHistory);

    // 3. Trả về Response bằng cách gọi hàm thông qua object bọc
    return createDataStreamResponse({
      execute: (dataStreamWriter) => {
        // Dùng ép kiểu (any) nếu TypeScript ở môi trường Vercel vẫn khắt khe với cấu trúc stream của LangChain
        const aiSdkStream = (LangChainAdapter as any).toDataStream(stream);
        dataStreamWriter.merge(aiSdkStream);
      },
    });

  } catch (error) {
    console.error("LangChain AI Error:", error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}
*/


import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createUIMessageStreamResponse, UIMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash", // Hoặc gemini-2.5-flash tùy bạn cấu hình
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    });

  // Convert AI SDK UIMessages to LangChain messages
  const langchainMessages = await toBaseMessages(messages);

  // Stream the response from the model
  const stream = await model.stream(langchainMessages);

  // Convert the LangChain stream to UI message stream
  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}


