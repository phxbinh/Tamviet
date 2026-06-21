import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const schema = z.object({
  intent: z.enum([
    "asset_lookup",
    "knowledge_search",
    "section_lookup",
    "hybrid_search",
    "general"
  ]),
  keyword: z.string().optional(),
  sectionId: z.string().optional()
});

export async function classifyIntent(
  message: string
) {
  const result = await generateObject({
    model: google("gemini-2.5-flash"),
    schema,
    prompt: `
Phân tích câu hỏi O&M.

Trả:
- intent
- keyword nếu có
- sectionId nếu có

Câu hỏi:
${message}
`
  });

  return result.object;
}