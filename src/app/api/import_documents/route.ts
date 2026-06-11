
import { NextRequest, NextResponse } from "next/server";

import { insertDocument } from "@/chatbot_OM/insertDocumentTree_Doc";

import {
  listDocuments,
} from "@/chatbot_OM/document/listDocuments";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const document =
      await insertDocument({
        assetId:
          body.assetId,

        documentType:
          body.documentType,

        title:
          body.title,

        version:
          body.version,

        markdown:
          body.markdown,

        metadata:
          body.metadata,
      });

    return NextResponse.json(
      document
    );
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

export async function GET() {
  try {
    const documents =
      await listDocuments();

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
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

