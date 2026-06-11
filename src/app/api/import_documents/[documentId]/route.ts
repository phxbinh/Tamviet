import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  updateDocument,
} from "@/chatbot_OM/updateDocumentTree_Doc";

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