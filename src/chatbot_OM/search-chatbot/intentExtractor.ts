import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const QuestionIntentSchema =
  z.object({
    topic: z.enum([
      "purpose",
      "principle",
      "safety",
      "startup",
      "operation",
      "shutdown",
      "maintenance",
      "troubleshooting",
      "parameter",
      "other",
    ]),
  });

export async function extractIntent(
  question: string
) {
  const result =
    await generateObject({
      model:
        google(
          "gemini-2.5-flash"
        ),

      temperature: 0,

      schema:
        QuestionIntentSchema,

      system: `
Phân loại chủ đề SOP.

safety:
- an toàn
- PPE
- điện giật
- khóa điện
- LOTO

startup:
- khởi động

shutdown:
- dừng máy

maintenance:
- bảo trì
- bảo dưỡng

troubleshooting:
- lỗi
- sự cố
- không chạy

operation:
- vận hành

purpose:
- mục đích

principle:
- nguyên lý

parameter:
- thông số
- giới hạn
`,
      prompt: question,
    });

  return result.object;
}