import { streamText } from "ai";
import { google } from "@ai-sdk/google";

//src/chatbot_OM/product-chat-ui-post
import { resolveDocumentTool }
  from "@/chatbot_OM/product-chat-ui-post/resolve-document";

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

When user asks to
open/view/find a document,
call resolveDocumentTool.
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

        const searchText =
          docRequest.result
            .searchText;

        const document =
          await findDocument(
            searchText
          );

        console.log(
          document
        );
      },
  });

  return result.toDataStreamResponse();
}