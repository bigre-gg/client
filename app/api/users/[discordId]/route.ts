import { NextRequest, NextResponse } from "next/server";

// 실제 환경에서는 DB 또는 외부 API에서 유저 정보를 가져와야 합니다.
// 여기서는 예시로 mock 데이터를 반환합니다.

export async function GET(
  req: NextRequest,
  { params }: { params: { discordId: string } }
) {
  try {
    const { discordId } = params;
    if (!discordId) {
      return new NextResponse("discordId is required", { status: 400 });
    }
    // 백엔드로 프록시 GET 요청
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${discordId}`,
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
      return new NextResponse(`Failed to fetch user: ${text}`, {
        status: backendRes.status,
      });
    }
    const result = await backendRes.json();
    return NextResponse.json(result);
  } catch (e) {
    console.error("Error proxying user get:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
