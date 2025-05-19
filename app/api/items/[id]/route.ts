import { NextRequest, NextResponse } from "next/server";
import { getItemById } from "@/lib/items";

// API 기본 URL
const API_BASE_URL = "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 공통 유틸리티 함수를 사용하여 아이템 정보 가져오기
    const item = await getItemById(params.id);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item from backend:", error);

    // 에러 종류에 따라 적절한 상태 코드 반환
    if ((error as Error).message.includes("Failed to fetch item")) {
      return NextResponse.json(
        { error: `Item with ID ${params.id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch item data" },
      { status: 500 }
    );
  }
}
