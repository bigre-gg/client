import { notFound } from "next/navigation";
import { Metadata } from "next";
import ItemDetailBody from "@/app/ui/item-detail-body";
import { getItemById } from "@/lib/items";

// 사이트 기본 URL (클라이언트와 서버 컴포넌트 모두에서 사용)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function ItemDetail({
  params,
}: {
  params: { id: string };
}) {
  try {
    // 공통 유틸리티 함수를 사용하여 직접 백엔드 API에서 아이템 정보 가져오기
    const item = await getItemById(params.id);

    return (
      <div className="flex flex-row" style={{ minHeight: 400 }}>
        <div style={{ minWidth: 300, maxWidth: 300 }}>
          <ItemDetailBody item={item} cardSize={300} />
        </div>
        <div className="flex-1" />
      </div>
    );
  } catch (error) {
    console.error("Error fetching item:", error);
    return notFound();
  }
}

export async function generateMetadata(props: any): Promise<Metadata> {
  try {
    // props를 await하고 params를 안전하게 추출
    const { params } = await props;
    const itemId = params.id;

    // 공통 유틸리티 함수를 사용하여 직접 백엔드 API에서 아이템 정보 가져오기
    const item = await getItemById(itemId);

    return {
      title: `${item.name} | 빅뱅리턴즈.GG`,
    };
  } catch (error) {
    console.error("Error fetching item for metadata:", error);
    return { title: "아이템 없음 | 빅뱅리턴즈.GG" };
  }
}
