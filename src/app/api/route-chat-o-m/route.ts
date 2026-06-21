import { google } from "@ai-sdk/google";
import { streamText } from "ai";

import { classifyIntent } from "./classifyIntent";

import { searchAssets } from "./searchAssets";
import { searchKnowledgeBase } from "./searchKnowledgeBase";
import { getSectionDetails } from "./getSectionDetails";

export const maxDuration = 60;

export async function POST(
  req: Request
) {
  const { messages } =
    await req.json();

  const latestMessage =
    messages[messages.length - 1]
      ?.content ?? "";

  // STEP 1
  const parsed =
    await classifyIntent(
      latestMessage
    );

  let context = "";

  // STEP 2
  switch (parsed.intent) {
    case "asset_lookup": {
      const rows =
        await searchAssets(
          parsed.keyword ??
            latestMessage
        );

      context = `
KẾT QUẢ TRA CỨU TÀI SẢN:

${JSON.stringify(
  rows,
  null,
  2
)}
      `;
      break;
    }

    case "knowledge_search": {
      const chunks =
        await searchKnowledgeBase(
          latestMessage
        );

      context = `
NGỮ CẢNH KỸ THUẬT:

${chunks
  .map(
    (c, i) => `
[Chunk ${i + 1}]
Asset: ${c.assetName}
Document: ${c.documentTitle}
Section: ${c.sectionPath}

${c.content}
`
  )
  .join("\n")}
      `;
      break;
    }

    case "section_lookup": {
      const section =
        await getSectionDetails(
          parsed.sectionId ?? ""
        );

      context = `
CHI TIẾT SECTION:

${JSON.stringify(
  section,
  null,
  2
)}
      `;
      break;
    }

    case "hybrid_search": {
      const assets =
        await searchAssets(
          parsed.keyword ??
            latestMessage
        );

      const chunks =
        await searchKnowledgeBase(
          latestMessage
        );

      context = `
ASSETS:

${JSON.stringify(
  assets,
  null,
  2
)}

KNOWLEDGE:

${chunks
  .map(
    (c) => `
${c.content}
`
  )
  .join("\n")}
      `;
      break;
    }

    default:
      context =
        "Không có dữ liệu nội bộ phù hợp.";
  }

  // STEP 3
  const result = streamText({
    model: google(
      "gemini-2.5-flash"
    ),

    system: `
Bạn là trợ lý kỹ thuật O&M.

QUY TẮC:

1. Chỉ dùng CONTEXT.
2. Không bịa thông số.
3. Nếu thiếu dữ liệu:
   nói rõ chưa cập nhật.
4. Với troubleshooting:
   trả theo:
   nguyên nhân → kiểm tra → hành động.

CONTEXT:

${context}
    `,

    messages
  });

  return result.toDataStreamResponse();
}