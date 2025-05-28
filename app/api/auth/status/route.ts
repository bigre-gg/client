import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("API Route Received Cookie Header:", req.headers.get("cookie"));
    // NestJS 백엔드의 유저 상태 엔드포인트로 쿠키 포함하여 요청
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/status`,
      {
        method: "GET", // 또는 백엔드 엔드포인트에 맞는 HTTP 메소드
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    if (!backendRes.ok) {
      const text = await backendRes.text();
      // 백엔드 오류 응답 상태 코드를 유지
      return new NextResponse(`Failed to fetch user status: ${text}`, {
        status: backendRes.status,
      });
    }

    // 백엔드에서 받은 JSON 응답을 프론트엔드로 전달
    const userData = await backendRes.json();
    return NextResponse.json(userData);
  } catch (e) {
    console.error("Error fetching user status:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
