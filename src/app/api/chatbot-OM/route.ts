import { NextRequest } from "next/server";

import { chat } from "@/chatbot_OM/chatbot";

export async function POST(
  request: NextRequest
) {
  const body =
    await request.json();

  const result =
    await chat(
      body.message
    );

  return Response.json(result);
}