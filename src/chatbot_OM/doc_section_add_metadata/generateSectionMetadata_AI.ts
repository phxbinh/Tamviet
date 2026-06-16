import {
  generateObject,
} from "ai";

import {
  google,
} from "@ai-sdk/google";

import {
  MetadataSchema,
} from "./metadataSchema";

import {
  detectSectionType,
} from "./detectSectionType";

export async function generateSectionMetadata(
  title: string,
  content: string,
  sectionPath: string
) {
  //----------------------------------
  // Rule Engine
  //----------------------------------

  const sectionType =
    detectSectionType(
      title
    );

  //----------------------------------
  // AI Metadata
  //----------------------------------

  const result =
    await generateObject({
      model:
        google(
          "gemini-2.5-flash"
        ),

      temperature: 0,

      schema:
        MetadataSchema,

      system: `
Bạn là bộ sinh metadata cho tài liệu O&M.

Mục tiêu:
- Hỗ trợ tìm kiếm tài liệu.
- Hỗ trợ intent matching.
- Hỗ trợ chatbot định vị đúng section.

QUY TẮC:

1. keywords:
- Là CỤM TỪ KHÓA.
- KHÔNG tách từng từ.
- Mỗi keyword dài 2-6 từ.
- Chỉ lấy các khái niệm quan trọng.

Ví dụ đúng:

[
  "bể sinh học hiếu khí",
  "bùn hoạt tính",
  "xử lý BOD",
  "xử lý COD",
  "vi sinh hiếu khí"
]

Ví dụ sai:

[
  "bể",
  "sinh",
  "học",
  "hiếu",
  "khí"
]

2. intentTags:
- Các loại câu hỏi user có thể hỏi.

Ví dụ:

[
  "purpose",
  "principle"
]

hoặc

[
  "shutdown",
  "emergency_shutdown",
  "safety"
]

3. summary:
- Tóm tắt 1 câu.
- Tối đa 200 ký tự.

4. sectionType:

purpose
principle
startup
operation
shutdown
maintenance
safety
troubleshooting
parameter
other

Nếu title đã thể hiện rõ sectionType thì ưu tiên dùng title.

Chỉ trả JSON.
`,

      prompt: `
SECTION PATH:
${sectionPath}

TITLE:
${title}

CONTENT:
${content.slice(
        0,
        4000
      )}
`,
    });

  //----------------------------------
  // Force rule engine
  //----------------------------------

  return {
    ...result.object,

    sectionType:
      sectionType ??
      result.object
        .sectionType,
  };
}