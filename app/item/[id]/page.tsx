"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import ItemDetailBody from "@/app/ui/item-detail-body";
import ItemFilter from "@/app/ui/item-filter";
import { getItemById } from "@/lib/items";
import { useRouter } from "next/navigation";
import NonEquipItemDetail from "@/app/ui/NonEquipItemDetail";
import items from "@/public/items.json";
import ItemIcon from "@/app/ui/ItemIcon";
import TradeListPanel from "@/app/ui/TradeListPanel";

export default function ItemDetail() {
  const params = useParams<{ id: string }>();
  const itemId = Number(params.id);

  // itemId로 isEquip, name 등 찾기 (useMemo로 id 변경 시마다 갱신)
  const itemMeta = useMemo(
    () => items.find((i: any) => i.id === itemId),
    [itemId]
  );

  const [item, setItem] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [descLoading, setDescLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({});
  const [trades, setTrades] = useState([]);
  const [showPendingOnly, setShowPendingOnly] = useState(true);
  const [sortType, setSortType] = useState<"latest" | "price">("latest");
  const [tradeFilter, setTradeFilter] = useState<any>(null);

  const router = useRouter();

  // itemId가 바뀔 때마다 상태 초기화
  useEffect(() => {
    setItem(null);
    setDescription("");
    setError(null);
    setLoading(true);
    setDescLoading(false);
    setFilters({});
    setTrades([]);
    setShowPendingOnly(true);
    setSortType("latest");
    setTradeFilter(null);
  }, [itemId]);

  useEffect(() => {
    if (!itemMeta) {
      setError("아이템 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }
    setLoading(true);
    getItemById(String(itemId))
      .then((data) => {
        if (!data || typeof data !== "object")
          throw new Error("아이템 데이터가 없습니다.");
        setItem(data);
        setDescription((data as any)?.description || "");
      })
      .catch((e) => setError("아이템 정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [itemId, itemMeta]);

  // trade 데이터 불러오기
  useEffect(() => {
    if (!itemId) return;
    fetch(`/api/trades?itemId=${itemId}`)
      .then((res) => res.json())
      .then((data) => setTrades(data || []));
  }, [itemId]);

  // 정렬/필터
  const filteredTrades = useMemo(() => {
    let arr = trades;
    if (showPendingOnly) arr = arr.filter((t: any) => t.status === "PENDING");
    if (sortType === "latest")
      arr = [...arr].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (sortType === "price")
      arr = [...arr].sort((a: any, b: any) => b.itemPrice - a.itemPrice);
    return arr;
  }, [trades, showPendingOnly, sortType]);
  const sellTrades = filteredTrades.filter((t: any) => t.type === "SELL");
  const buyTrades = filteredTrades.filter((t: any) => t.type === "BUY");

  // 시간 표시 함수
  function getTimeAgo(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 10) return `${Math.floor(diff)}초 전`;
    if (diff < 60) return `${Math.floor(diff)}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  }
  // 디스코드 아바타 url
  function getDiscordAvatarUrl(
    userDiscordId: string,
    userAvatar: string,
    idx: number
  ) {
    if (!userAvatar || userAvatar === "0") {
      return `https://cdn.discordapp.com/embed/avatars/${idx % 5}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${userDiscordId}/${userAvatar}.png`;
  }
  // 옵션 비교 태그
  function getOptionTags(base: any, trade: any) {
    if (!base || !trade) return [];
    const tags = [];
    for (const key in base.options) {
      const baseVal = base.options[key] || 0;
      const tradeVal = (trade.options && trade.options[key]) || 0;
      const diff = tradeVal - baseVal;
      if (diff > 0) tags.push(`${key} +${diff}`);
      else if (diff < 0) tags.push(`${key} ${diff}`);
    }
    // trade.options에만 있는 추가 옵션
    for (const key in trade.options) {
      if (!(key in base.options)) {
        tags.push(`${key} +${trade.options[key]}`);
      }
    }
    return tags;
  }
  // 잠재옵션 태그
  function getPotentialTags(trade: any) {
    if (!trade.potentialOptions) return [];
    return Object.entries(trade.potentialOptions).map(([k, v]) => `${k} +${v}`);
  }
  // customOptions 태그
  function getCustomTags(trade: any) {
    if (!trade.customOptions) return [];
    return trade.customOptions.map((opt: any) => `${opt.label} ${opt.value}`);
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // 필터링된 아이템을 가져오는 API 호출 등을 구현할 수 있습니다.
  };

  if (loading) return <div className="p-4">아이템 정보를 불러오는 중...</div>;
  if (error) return <div className="p-4">{error}</div>;
  if (!itemMeta) return <div className="p-4">아이템을 찾을 수 없습니다.</div>;

  return (
    <div
      key={itemId}
      className="w-full flex flex-col items-center px-2 sm:px-0"
    >
      <div className="w-full flex flex-col items-center min-h-[400px]">
        <div className="relative w-full flex flex-col items-center p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full max-w-full sm:max-w-5xl justify-center items-start mt-2 sm:mt-4">
            {/* 아이템 디테일 */}
            <div className="flex-shrink-0 w-full sm:w-auto mb-4 sm:mb-0">
              {item ? (
                item.type === "OTHERS" ? (
                  <NonEquipItemDetail
                    itemId={item.itemId}
                    name={item.name}
                    description={item.description}
                  />
                ) : (
                  <ItemDetailBody item={item} />
                )
              ) : null}
              <div className="mt-3 sm:mt-5">
                <ItemFilter
                  item={item}
                  onFilterChange={handleFilterChange}
                  onApply={setTradeFilter}
                />
              </div>
            </div>
            {/* 거래 리스트 패널 */}
            <div className="flex-1 min-w-0 w-full sm:min-w-[340px] sm:max-w-[700px]">
              <TradeListPanel
                itemId={itemId}
                itemMeta={itemMeta}
                baseItem={item}
                filter={tradeFilter}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
