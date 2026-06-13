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

    assetName:
      z.string().nullable(),
  });

export type QuestionIntent =
  z.infer<
    typeof QuestionIntentSchema
  >;

export async function extractIntent(
  question: string
): Promise<QuestionIntent> {
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
Bạn là bộ phân tích câu hỏi O&M.

Nhiệm vụ:

1. Xác định topic.
2. Trích xuất assetName nếu có.

Ví dụ:

"Cách vận hành bể sinh học hiếu khí"

{
  "topic": "operation",
  "assetName": "bể sinh học hiếu khí"
}

"An toàn lao động khi bảo trì bơm bể gom"

{
  "topic": "safety",
  "assetName": "bơm bể gom"
}

"Nguyên nhân bùn nổi Aerotank"

{
  "topic": "troubleshooting",
  "assetName": "aerotank"
}

"Nồng độ DO bao nhiêu"

{
  "topic": "parameter",
  "assetName": null
}

Quy tắc:

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
- nguyên nhân
- xử lý

operation:
- vận hành

purpose:
- mục đích
- phạm vi áp dụng

principle:
- nguyên lý

parameter:
- thông số
- giới hạn
- DO
- MLSS
- pH
- ORP

Nếu không xác định được asset thì:
assetName = null

Chỉ trả dữ liệu đúng schema.
`,
      prompt: question,
    });

  return result.object;
}