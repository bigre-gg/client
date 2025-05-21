"use client";

import { useState, useEffect } from "react";
import ItemDetailBody from "@/app/ui/item-detail-body";
import ItemFilter from "@/app/ui/item-filter";
import { getItemById } from "@/lib/items";
import { useRouter } from "next/navigation";
import NonEquipItemDetail from "@/app/ui/NonEquipItemDetail";
import items from "@/public/items.json";

export default function ItemDetail({ params }: { params: { id: string } }) {
  const itemId = Number(params.id);

  // itemId로 isEquip, name 등 찾기
  const itemMeta = items.find((i: any) => i.id === itemId);

  const [item, setItem] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [descLoading, setDescLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (!itemMeta) {
      setError("아이템 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    if (itemMeta.isEquip) {
      // 장비 아이템: getItemById 호출
      setLoading(true);
      getItemById(String(itemId))
        .then((data) => setItem(data))
        .catch(() => setError("장비 정보를 불러오지 못했습니다."))
        .finally(() => setLoading(false));
    } else {
      // 비장비 아이템: 외부 API만 호출
      setDescLoading(true);
      fetch(`https://maplestory.io/api/kms/300/item/${itemId}`)
        .then((res) => res.json())
        .then((data) => setDescription(data?.description?.description || ""))
        .catch(() => setError("설명 정보를 불러오지 못했습니다."))
        .finally(() => {
          setDescLoading(false);
          setLoading(false);
        });
    }
  }, [itemId]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // 필터링된 아이템을 가져오는 API 호출 등을 구현할 수 있습니다.
  };

  if (loading) return <div className="p-4">아이템 정보를 불러오는 중...</div>;
  if (error) return <div className="p-4">{error}</div>;
  if (!itemMeta) return <div className="p-4">아이템을 찾을 수 없습니다.</div>;

  return (
    <div className="w-full">
      <div className="w-full" style={{ minHeight: 400 }}>
        <div className="relative w-full p-4">
          <button
            className="absolute right-4 top-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto sm:min-w-[140px]"
            onClick={() => router.push(`/item/${itemId}/register`)}
            style={{ zIndex: 10 }}
          >
            아이템 등록
          </button>
          <div className="flex flex-col gap-4 items-start">
            {itemMeta.isEquip ? (
              item ? (
                <ItemDetailBody item={item} />
              ) : null
            ) : descLoading ? (
              <div className="p-4">설명 정보를 불러오는 중...</div>
            ) : (
              <NonEquipItemDetail
                itemId={itemId}
                name={itemMeta.name}
                description={description}
              />
            )}
            <ItemFilter item={item} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
