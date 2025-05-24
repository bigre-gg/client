import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // 실제 백엔드로 프록시 POST 요청
    const backendRes = await fetch("http://localhost:8000/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const contentType = backendRes.headers.get("content-type");
    if (!backendRes.ok) {
      const text = await backendRes.text();
      return new NextResponse(`Failed to register trade: ${text}`, {
        status: backendRes.status,
      });
    }

    if (contentType && contentType.includes("application/json")) {
      const result = await backendRes.json();
      return NextResponse.json(result);
    } else {
      const text = await backendRes.text();
      return new NextResponse(text, { status: 200 });
    }
  } catch (e) {
    console.error("Error proxying trade register:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
