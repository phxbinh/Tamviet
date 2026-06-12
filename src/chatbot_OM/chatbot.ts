import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { vectorSearch } from "./vectorSearch";

export async function chat(
  question: string
) {
  //----------------------------------
  // Search
  //----------------------------------

  const chunks =
    await vectorSearch({
      query: question,
      limit: 10,
    });

  //----------------------------------
  // Context
  //----------------------------------

  const context =
    chunks
      .map(
        (chunk) =>
          `
SECTION:
${chunk.sectionPath}

CONTENT:
${chunk.content}
`
      )
      .join("\n\n");

  //----------------------------------
  // LLM
  //----------------------------------

  const result =
    await generateText({
      model:
        google("gemini-2.5-flash"),

      system: `
Bạn là chuyên gia vận hành.
Chỉ trả lời bằng dữ liệu trong context.
Nếu context không có thông tin
hãy nói không tìm thấy dữ liệu.
`,

      prompt: `
CONTEXT:

${context}

QUESTION:

${question}
`,
    });

  return {
    answer: result.text,
    chunks,
  };
}