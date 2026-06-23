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



// Gemini ->spaw
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
// 1. Nhập hàm chuyển đổi luồng dữ liệu chuẩn từ adapter langchain
import { toDataStream } from "@ai-sdk/langchain";
// 2. Nhập hàm tạo Response từ package lõi 'ai'
import { createDataStreamResponse } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash", // Mô hình Gemini chuẩn
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

    // 3. Biến đổi luồng stream của LangChain thành cấu trúc Data Stream của AI SDK
    const aiSdkDataStream = toDataStream(stream);

    // 4. Trả về HTTP Response chuẩn phối hợp giữa hai thư viện cho frontend useChat nhận diện
    return createDataStreamResponse({
      execute: (dataStreamWriter) => {
        dataStreamWriter.merge(aiSdkDataStream);
      },
    });

  } catch (error) {
    console.error("LangChain AI Error:", error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}



