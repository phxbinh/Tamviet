import {
  NextRequest,
  NextResponse,
} from "next/server";

// src/chatbot_OM/updateDocumentTree_Doc.ts
import {
  updateDocument,
} from "@/chatbot_OM/updateDocumentTree_Doc";

import {
  getDocumentById,
} from "@/chatbot_OM/document/getDocumentById";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const document =
      await getDocumentById({documentId:id});

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Document not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: document,
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

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const body =
      await request.json();

    const { id } =
      await context.params;

    const document =
      await updateDocument({
        documentId: id,
        ...body,
      });

    return NextResponse.json({
      success: true,
      data: document,
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