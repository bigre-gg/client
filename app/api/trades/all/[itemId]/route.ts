import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    if (!itemId) {
      return new NextResponse("itemId is required", { status: 400 });
    }
    // 백엔드로 프록시 GET 요청
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/trades/all/${itemId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );
    if (!backendRes.ok) {
      const text = await backendRes.text();
      return new NextResponse(`Failed to fetch trades: ${text}`, {
        status: backendRes.status,
      });
    }
    const result = await backendRes.json();
    return NextResponse.json(result);
  } catch (e) {
    console.error("Error proxying trade get:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
