import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new NextResponse("id is required", { status: 400 });
  }
  console.log("id", id);
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/trades/${id}`,
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
    return new NextResponse(`Failed to fetch trade: ${text}`, {
      status: backendRes.status,
    });
  }
  const result = await backendRes.json();
  return NextResponse.json(result);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new NextResponse("id is required", { status: 400 });
  }
  const data = await req.json();
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/trades/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!backendRes.ok) {
    const text = await backendRes.text();
    return new NextResponse(`Failed to update trade: ${text}`, {
      status: backendRes.status,
    });
  }
  const result = await backendRes.json();
  return NextResponse.json(result);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new NextResponse("id is required", { status: 400 });
  }
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/trades/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    }
  );
  if (!backendRes.ok) {
    const text = await backendRes.text();
    return new NextResponse(`Failed to cancel trade: ${text}`, {
      status: backendRes.status,
    });
  }
  return new NextResponse(null, { status: 204 });
}
