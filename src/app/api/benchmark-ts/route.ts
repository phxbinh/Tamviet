import { NextResponse } from 'next/server';

function isPrimeTS(n: number): boolean {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

export async function GET() {
  const start = performance.now();

  const limit = 2000000;
  let sum = 0;
  for (let i = 2; i < limit; i++) {
    if (isPrimeTS(i)) {
      sum += i;
    }
  }

  const end = performance.now();
  const duration = end - start;

  return NextResponse.json({
    language: 'TypeScript (Next.js Route)',
    limit: limit,
    sum_result: sum,
    execution_time_ms: duration,
  });
}
