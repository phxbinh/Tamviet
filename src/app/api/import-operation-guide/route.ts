import {
  importOperationGuide,
} from "@/chatbot-guide-OM/importOperationGuide";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const result =
      await importOperationGuide(
        body.markdown
      );

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
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