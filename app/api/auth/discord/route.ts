import { NextResponse } from "next/server";

export async function GET() {
  // NestJS 백엔드의 Discord 인증 시작 엔드포인트로 리다이렉트
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/discord`
  );
}
