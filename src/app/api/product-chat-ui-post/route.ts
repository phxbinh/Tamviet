/*
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

import {
  resolveDocumentTool,
  resolveDocumentSchema,
} from "@/chatbot_OM/product-chat-ui-post/resolve-document";

import { findDocument }
  from "@/chatbot_OM/product-chat-ui-post/find-document";

export async function POST(
  req: Request
) {
  const { messages } =
    await req.json();

  const result = streamText({
    model: google(
      "gemini-2.5-flash"
    ),

    system: `
You are an O&M assistant.

When user asks to:
- open a document
- view a document
- find a document
- SOP
- operation manual
- maintenance manual

always call resolveDocumentTool.
`,

    messages,

    tools: {
      resolveDocumentTool,
    },

    maxSteps: 2,

    onStepFinish:
      async ({ toolResults }) => {
        const docRequest =
          toolResults.find(
            (tool) =>
              tool.toolName ===
              "resolveDocumentTool"
          );

        if (!docRequest) {
          return;
        }

        const parsed =
          resolveDocumentSchema.parse(
            docRequest.result
          );

        const searchText =
          parsed.searchText;

        const document =
          await findDocument(
            searchText
          );

        if (!document) {
          console.log(
            "Document not found"
          );
          return;
        }

        console.log(
          "Found document:",
          foundDoc.id
        );
      },
  });

  return Response.json({
    success: true,
    documentId: foundDoc,
  });
}
*/

/*
  return result.toDataStreamResponse();
}

*/

import { streamText } from "ai";
import { google } from "@ai-sdk/google";

import {
  resolveDocumentTool,
  resolveDocumentSchema,
} from "@/chatbot_OM/product-chat-ui-post/resolve-document";

import { findDocument } from "@/chatbot_OM/product-chat-ui-post/find-document";

export async function POST(
  req: Request
) {
  const { messages } =
    await req.json();

  let resolvedDocumentId:
    string | null = null;

  await streamText({
    model: google(
      "gemini-2.5-flash"
    ),

    system: `
You are an O&M assistant.

When user asks to:
- open a document
- view a document
- find a document
- SOP
- operation manual
- maintenance manual

always call resolveDocumentTool.
`,

    messages,

    tools: {
      resolveDocumentTool,
    },

    maxSteps: 2,

    onStepFinish:
      async ({ toolResults }) => {
        const docRequest =
          toolResults.find(
            (tool) =>
              tool.toolName ===
              "resolveDocumentTool"
          );

        if (!docRequest) {
          return;
        }

        const parsed =
          resolveDocumentSchema.parse(
            docRequest.result
          );

        const foundDoc =
          await findDocument(
            parsed.searchText
          );

        if (!foundDoc) {
          return;
        }

        resolvedDocumentId =
          foundDoc.id;
      },
  });

  return Response.json({
    success:
      !!resolvedDocumentId,
    documentId:
      resolvedDocumentId,
  });
}

