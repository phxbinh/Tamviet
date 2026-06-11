import { NextRequest, NextResponse } from "next/server";

import { insertDocument } from "@/chatbot_OM/importDocumentTree_Doc";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const document =
      await insertDocument(body);

    return NextResponse.json(
      document
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}