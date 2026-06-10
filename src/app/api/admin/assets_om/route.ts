import { NextRequest, NextResponse } from "next/server";

import { createAsset } from "@/chatbot_OM/services/assets/createAsset";
import { listAssets } from "@/chatbot_OM/services/assets/listAssets";

export async function GET() {
  try {
    const assets = await listAssets();

    return NextResponse.json(assets);
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

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const asset =
      await createAsset(body);

    return NextResponse.json(
      asset
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