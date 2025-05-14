import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // NestJS에서 인증 후, 세션 쿠키를 설정한 뒤 프론트엔드로 리다이렉트
  // 필요하다면 여기서 추가 처리(예: 유저 정보 fetch) 가능
  return NextResponse.redirect("/");
}
