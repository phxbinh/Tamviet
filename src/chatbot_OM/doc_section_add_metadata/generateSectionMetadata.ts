import {
  generateObject,
} from "ai";

import {
  google,
} from "@ai-sdk/google";

import { z } from "zod";

import {
  detectSectionType,
} from "./detectSectionType";

import {
  buildKeywords,
} from "./buildKeywords";

const MetadataSchema =
  z.object({
    sectionType:
      z.enum([
        "purpose",
        "principle",
        "startup",
        "operation",
        "shutdown",
        "maintenance",
        "safety",
        "troubleshooting",
        "parameter",
        "other",
      ]),

    keywords:
      z.array(
        z.string()
      ),

    intentTags:
      z.array(
        z.string()
      ),
  });

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

  if (sectionType) {

    return {
      sectionType,

      keywords:
        buildKeywords(
          title,
          sectionPath
        ),

      intentTags: [
        sectionType,
      ],
    };
  }

  //----------------------------------
  // AI Fallback
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
Bạn là bộ phân loại tài liệu O&M.

Chỉ sinh:

- sectionType
- keywords
- intentTags

sectionType:

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

Không giải thích.
Chỉ trả JSON.
`,

      prompt: `
TITLE:
${title}

CONTENT:
${content.slice(
        0,
        3000
      )}
`,
    });

  return result.object;
}