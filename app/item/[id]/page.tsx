"use client";

import { useState, useEffect } from "react";
import ItemDetailBody from "@/app/ui/item-detail-body";
import ItemFilter from "@/app/ui/item-filter";
import { getItemById, ItemApiResponse } from "@/lib/items";

export default function ItemDetail({ params }: { params: { id: string } }) {
  const itemId = params.id;

  const [item, setItem] = useState<ItemApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState({});

  // 아이템 데이터 가져오기
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const data = await getItemById(itemId);
        setItem(data);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [itemId]);

  // 필터 상태 업데이트
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    console.log("New filters:", newFilters);
    // 여기서 필터링된 아이템을 가져오는 API 호출 등을 구현할 수 있습니다.
  };

  if (loading) {
    return <div className="p-4">아이템 정보를 불러오는 중...</div>;
  }

  if (error || !item) {
    return <div className="p-4">아이템을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="w-full flex flex-row gap-4 p-4">
      {/* 왼쪽: 아이템 상세 정보 */}
      <div
        className="flex-none bg-gray-100 dark:bg-zinc-800 rounded-lg p-4"
        style={{ width: 320 }}
      >
        <ItemDetailBody item={item} cardSize={300} />
        <div className="mt-4"></div>
      </div>

      {/* 오른쪽: 필터 */}
      <div className="flex-1 min-w-0 bg-gray-100 dark:bg-zinc-800 rounded-lg flex justify-start items-start">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 rounded-lg" />
          <div className="relative z-10 flex justify-start items-start">
            <div className="w-full">
              <ItemFilter item={item} onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
