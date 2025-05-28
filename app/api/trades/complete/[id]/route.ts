import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return new NextResponse("id is required", { status: 400 });
  }
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/trades/complete/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    }
  );
  if (!backendRes.ok) {
    const text = await backendRes.text();
    return new NextResponse(`Failed to complete trade: ${text}`, {
      status: backendRes.status,
    });
  }
  const result = await backendRes.json();
  return NextResponse.json(result);
}
