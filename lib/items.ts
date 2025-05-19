// 백엔드 API 기본 URL
const API_BASE_URL = "http://localhost:8000";

// 아이템 인터페이스
export interface ItemApiResponse {
  _id: string;
  itemId: number;
  name: string;
  price: number;
  tuc: number;
  options: {
    [key: string]: number | undefined;
  };
  subCategory: string;
  reqLevelEquip: number;
  reqSTR: number;
  reqDEX: number;
  reqINT: number;
  reqLUK: number;
  reqJob: number;
}

/**
 * 백엔드 API에서 아이템 정보를 가져오는 유틸리티 함수
 * 서버 컴포넌트와 API 라우트 모두에서 재사용 가능
 */
export async function getItemById(itemId: string): Promise<ItemApiResponse> {
  const res = await fetch(`${API_BASE_URL}/items/${itemId}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch item with ID ${itemId}`);
  }

  return res.json();
}
