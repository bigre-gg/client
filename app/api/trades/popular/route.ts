import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/trades/popular`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include", // 필요시 추가
    }
  );
  if (!backendRes.ok) {
    const text = await backendRes.text();
    return new NextResponse(`Failed to fetch popular items: ${text}`, {
      status: backendRes.status,
    });
  }
  const result = await backendRes.json();
  return NextResponse.json(result);
}
