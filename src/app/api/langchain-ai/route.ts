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
// Nhập hàm chuyển đổi stream
//import { LangChainAdapter } from "@ai-sdk/langchain"; 
// SỬA DÒNG 77 THÀNH DẠNG NÀY:
import * as LangChainAdapter from "@ai-sdk/langchain";

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

    // Dùng LangChainAdapter để biến đổi stream thành định dạng AI SDK tương thích với useChat
    return LangChainAdapter.toDataStreamResponse(stream);

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}


