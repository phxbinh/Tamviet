/*
// 🟢Dùng cho vectorSearch();

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
*/

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  searchKnowledge,
} from "@/chatbot_OM/search-chatbot/searchKnowledge";


//import {
//  searchKnowledge,
//} from "@/chatbot_OM/search-chatbot/searchKnowledge_";


export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const result =
      await searchKnowledge(
        body.query,
        body.assetId
      );


/*
    const result =
      await searchKnowledge(
        body.query
      );
*/

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












