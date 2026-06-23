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
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
// 1. Chỉ cần import duy nhất module này từ adapter
import * as LangChainAdapter from "@ai-sdk/langchain";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash", // Hoặc "gemini-2.5-flash" tùy phiên bản bạn dùng
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    });

    const chatHistory = messages.map((msg: any) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });

    // 2. Gọi stream từ LangChain 
    const stream = await model.stream(chatHistory);

    // 3. Sử dụng trực tiếp hàm toAIStreamResponse để trả thẳng về cho useChat
    // Hàm này tự động cấu hình Header HTTP và format Token để frontend đọc được ngay
    return (LangChainAdapter as any).toAIStreamResponse(stream);

  } catch (error) {
    console.error("LangChain AI Error:", error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}



