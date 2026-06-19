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

/*
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

        console.log(
          "Found document:",
          foundDoc.id
        );
      },
  });

  return Response.json({
    success:
      !!resolvedDocumentId,
    documentId:
      resolvedDocumentId,
  });
}
*/

import { streamText } from "ai";
import { google } from "@ai-sdk/google";

import {
  resolveDocumentTool,
  resolveDocumentSchema,
} from "@/chatbot_OM/product-chat-ui-post/resolve-document";

import { findDocument } from "@/chatbot_OM/product-chat-ui-post/find-document";

/*
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    let resolvedDocumentId: string | null = null;

    const result = await streamText({
      model: google("gemini-2.5-flash"),
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
`, // system prompt của bạn
      messages,
      tools: { resolveDocumentTool },
      maxSteps: 3,
      onStepFinish: async ({ toolResults }) => {
        const docRequest = toolResults.find(
          (tool) => tool.toolName === "resolveDocumentTool"
        );

        if (!docRequest?.result) return;

        try {
          const parsed = resolveDocumentSchema.parse(docRequest.result);
//console.log("parsed: ", parsed, "parsed.searchText: ", parsed.searchText, "typeof: ", typeof parsed.searchText);
          const foundDoc = await findDocument(parsed.searchText);
console.log("foundDoc: ", foundDoc);
          if (foundDoc) {
            resolvedDocumentId = foundDoc.id;
          }
        } catch (e) {
          console.error("Parse tool result error:", e);
        }
      },
    });

    // Trả về stream cho client
    return result.toDataStreamResponse();

  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
*/
export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    let resolvedDocumentId: string | null = null;

    await streamText({
      model: google("gemini-2.5-flash"),
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
      tools: { resolveDocumentTool },
      maxSteps: 3,
      onStepFinish: async ({ toolResults }) => {
        const docRequest = toolResults.find(
          (tool) =>
            tool.toolName === "resolveDocumentTool"
        );

        if (!docRequest?.result) return;

        const parsed =
          resolveDocumentSchema.parse(
            docRequest.result
          );

        const foundDoc =
          await findDocument(
            parsed.searchText
          );

        if (foundDoc) {
          resolvedDocumentId =
            foundDoc.id;
        }
      },
    });

    return Response.json({
      success:
        !!resolvedDocumentId,
      documentId:
        resolvedDocumentId,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}


