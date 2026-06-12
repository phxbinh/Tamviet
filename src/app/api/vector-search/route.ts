import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  vectorSearch,
} from "@/chatbot_OM/vectorSearch";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const result =
      await vectorSearch({
        query:
          body.query,
        limit:
          body.limit ?? 10,
      });

    return NextResponse.json({
      success: true,
      data: result,
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