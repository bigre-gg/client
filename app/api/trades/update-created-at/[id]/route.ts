import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return new NextResponse("id is required", { status: 400 });
  }
  // 인증 쿠키 전달
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/trades/update-created-at/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    }
  );
  if (!backendRes.ok) {
    const text = await backendRes.text();
    return new NextResponse(`Failed to update createdAt: ${text}`, {
      status: backendRes.status,
    });
  }
  const result = await backendRes.json();
  return NextResponse.json(result);
}
