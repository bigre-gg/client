import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // NestJS 로그아웃 엔드포인트로 쿠키 포함하여 요청
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    if (!backendRes.ok) {
      const text = await backendRes.text();
      return new NextResponse(`Logout failed: ${text}`, {
        status: backendRes.status,
      });
    }

    // 백엔드에서 Set-Cookie 헤더를 전달받아 프론트로 전달
    const res = NextResponse.redirect(process.env.NEXT_PUBLIC_FRONTEND_URL!);
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }
    return res;
  } catch (e) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
