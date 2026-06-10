import { NextRequest, NextResponse } from "next/server";

import { insertDocumentTree } from "@/chatbot_OM/insertDocumentTree";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const result =
      await insertDocumentTree({
        assetId: body.assetId,
        documentType: body.documentType,
        version: body.version,
        markdown: body.markdown,
      });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Import failed",
      },
      {
        status: 500,
      }
    );
  }
}