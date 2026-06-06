// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Health check - Server is running",
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    coldStart: "detected by cron",
  });
}

// Optional: Cho phép OPTIONS để CORS hoạt động tốt
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}