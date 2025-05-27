"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import ItemIcon from "@/app/ui/ItemIcon";
import { useRouter } from "next/navigation";
import TradeEquipDetailBody from "@/app/ui/TradeEquipDetailBody";
import ItemDetailBody from "@/app/ui/item-detail-body";
import NonEquipItemDetail from "@/app/ui/NonEquipItemDetail";

interface TradeListPanelProps {
  tradesWithBaseItem?: { trade: any; baseItem: any }[];
  showFilterBar?: boolean;
  itemId?: number;
  itemMeta?: any;
  baseItem?: any;
  baseItems?: any[];
  trades?: any[];
  filter?: any;
  heightClass?: string;
}

// 옵션 한글/영문 번역 테이블
export const OPTION_TRANSLATIONS: Record<string, string> = {
  incSTR: "STR",
  incDEX: "DEX",
  incINT: "INT",
  incLUK: "LUK",
  incPAD: "공격력",
  incMAD: "마력",
  incPDD: "물리 방어력",
  incMDD: "마법 방어력",
  incACC: "명중률",
  incEVA: "회피율",
  incSpeed: "이동 속도",
  incJump: "점프력",
  incMHP: "최대 HP",
  incMMP: "최대 MP",
};

// 코인 문자열 파싱 함수
function parseCoinString(coinStr?: string) {
  if (!coinStr) return { g: 0, s: 0, b: 0 };
  const match = coinStr.match(/(\d+)g(\d+)s(\d+)b/);
  if (!match) return { g: 0, s: 0, b: 0 };
  return { g: Number(match[1]), s: Number(match[2]), b: Number(match[3]) };
}

// 코인 표시 여부 함수
function shouldShowCoin(coinStr?: string) {
  if (!coinStr) return false;
  const { g, s, b } = parseCoinString(coinStr);
  return g > 0 || s > 0 || b > 0;
}

// 팝오버(툴팁) 컴포넌트
function Popover({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={(e) => {
        setOpen(true);
        setPos({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      onMouseMove={(e) => {
        if (open) {
          setPos({
            x: e.clientX,
            y: e.clientY,
          });
        }
      }}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          style={{
            position: "fixed",
            top: pos.y + 8,
            left: pos.x + 8,
            zIndex: 9999,
          }}
        >
          {content}
        </div>
      )}
    </span>
  );
}

// 잠재옵션 한글 변환 매핑 (EditableItemDetailBody와 동일)
const POTENTIAL_OPTION_TRANSLATIONS: Record<string, string> = {
  str: "STR",
  dex: "DEX",
  int: "INT",
  luk: "LUK",
  strP: "STR",
  dexP: "DEX",
  intP: "INT",
  lukP: "LUK",
  allStatP: "올스탯",
  pad: "공격력",
  padP: "공격력",
  mad: "마력",
  madP: "마력",
  hp: "HP",
  hpP: "HP",
  mp: "MP",
  mpP: "MP",
  pdd: "물리 방어력",
  mdd: "마법 방어력",
  acc: "명중치",
  eva: "회피치",
  bossDmgP: "보스 몬스터 공격 시 데미지 증가",
  critRateP: "크리티컬 확률 증가",
  dmgP: "총 데미지",
  iedP: "몬스터 방어율 무시",
  invincSec: "피격 후 무적 시간 증가",
  healEffP: "HP 회복 아이템/스킬 효율",
  allResistP: "모든 속성 내성",
  dropRateP: "아이템/메소 획득 확률",
  mpReduceP: "모든 스킬의 MP 소모",
};

// 모달 오버레이 컴포넌트
function TradeDetailModal({
  trade,
  baseItem,
  onClose,
  getOptionTags,
  getPotentialTags,
  getCustomTags,
}: {
  trade: any;
  baseItem: any;
  onClose: () => void;
  getOptionTags: (base: any, trade: any) => string[];
  getPotentialTags: (trade: any) => string[];
  getCustomTags: (trade: any) => string[];
}) {
  const router = useRouter();
  if (!trade) return null;
  const isEquip = (trade.itemType || baseItem.type) === "EQUIP";
  // 유저 정보
  const avatar =
    trade.userAvatar && trade.userDiscordId
      ? `https://cdn.discordapp.com/avatars/${trade.userDiscordId}/${trade.userAvatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-100 dark:bg-[#23272f] rounded-2xl shadow-2xl p-0 flex flex-col min-w-[340px] max-w-[95vw] w-[370px] border border-gray-700 transition-all duration-200 ease-out transform scale-95 opacity-0 animate-fadein-slide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단: 팝니다/삽니다 + 등록일, 유저 정보, X버튼 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center flex-1 gap-2">
            <span
              className={`font-bold text-base px-3 py-1 rounded-xl ${
                trade.type === "SELL"
                  ? "bg-blue-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {trade.type === "SELL" ? "팝니다" : "삽니다"}
            </span>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {getTimeAgo(trade.createdAt)}
            </span>
          </div>
          {/* 유저 정보 */}
          <div className="flex flex-col items-center ml-2">
            <img
              src={avatar}
              className="w-8 h-8 rounded-full mb-1"
              alt="avatar"
            />
            <span className="text-xs truncate max-w-[90px] text-center">
              {trade.userGlobalName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-red-500 font-bold ml-2"
          >
            ×
          </button>
        </div>
        {/* 카드 본문 */}
        <div className="px-5 pb-2 pt-1">
          {/* 아이템 디테일 카드 */}
          <div className="flex justify-center mb-2">
            {isEquip ? (
              <TradeEquipDetailBody
                item={baseItem}
                trade={trade}
                cardSize={120}
              />
            ) : trade.itemType === "OTHERS" ? (
              <NonEquipItemDetail
                itemId={baseItem.itemId}
                name={baseItem.name}
                description={(baseItem as any).description ?? ""}
                cardSize={120}
              />
            ) : (
              <ItemDetailBody item={baseItem} cardSize={120} />
            )}
          </div>
          {/* 가격/수량 - 가운데 정렬 */}
          <div className="flex flex-col items-center justify-center mb-2 px-0">
            <span className="text-black dark:text-white font-bold text-lg flex items-center gap-1">
              {trade.itemPrice?.toLocaleString() || "-"}
              <img
                src="/meso.png"
                alt="메소"
                style={{
                  width: 20,
                  height: 20,
                  display: "inline-block",
                  marginLeft: 2,
                }}
              />
              {shouldShowCoin(trade.coin) && (
                <span className="flex items-center gap-1 ml-2">
                  <span className="text-gray-500 font-bold">or</span>
                  {(() => {
                    const { g, s, b } = parseCoinString(trade.coin);
                    return (
                      <span className="flex items-center gap-1">
                        {g > 0 && (
                          <>
                            <img
                              src="/goldCoin.png"
                              alt="Gold"
                              className="w-5 h-5 inline-block"
                            />
                            {g}
                          </>
                        )}
                        {s > 0 && (
                          <>
                            <img
                              src="/silverCoin.png"
                              alt="Silver"
                              className="w-5 h-5 inline-block"
                            />
                            {s}
                          </>
                        )}
                        {b > 0 && (
                          <>
                            <img
                              src="/bronzeCoin.png"
                              alt="Bronze"
                              className="w-5 h-5 inline-block"
                            />
                            {b}
                          </>
                        )}
                      </span>
                    );
                  })()}
                </span>
              )}
            </span>
            <span className="text-black dark:text-white text-sm">
              {trade.quantity || 1}개
            </span>
          </div>
          {/* 코멘트 */}
          {trade.comment && (
            <div className="mb-2 text-sm text-center text-gray-800 dark:text-gray-200 font-semibold break-words bg-gray-100 dark:bg-[#181c23] rounded-lg px-3 py-2">
              {trade.comment}
            </div>
          )}
          {/* 태그들 (흥정 태그 포함) */}
          <div className="flex flex-wrap gap-2 justify-center mb-2 mt-2">
            {getOptionTags(baseItem, trade).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="bg-blue-600 dark:bg-blue-700 text-white text-[15px] px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {getPotentialTags(trade).map((tag: string, idx: number) => (
              <span
                key={"potential-" + idx}
                className="bg-purple-600 dark:bg-purple-700 text-white text-[15px] px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {getCustomTags(trade).map((tag: string, idx: number) => (
              <span
                key={"custom-" + idx}
                className="bg-purple-600 dark:bg-purple-700 text-white text-[15px] px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[15px] px-2 py-1 rounded">
              {trade.upgradeCount} 작
            </span>
            <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[15px] px-2 py-1 rounded">
              업횟 {trade.tuc}
            </span>
            <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[15px] px-2 py-1 rounded">
              {trade.tradeWorld}
            </span>
            <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[15px] px-2 py-1 rounded">
              {trade.haggling === "IMPOSSIBLE"
                ? "흥정 불가"
                : trade.haggling === "POSSIBLE"
                ? "흥정 가능"
                : "제안 받음"}
            </span>
          </div>
        </div>
        {/* 하단 버튼 */}
        <div className="flex justify-between items-center px-5 pb-5 pt-2 gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded bg-gray-700 text-white font-bold text-base hover:bg-gray-600"
          >
            닫기
          </button>
          <button
            onClick={() => {
              if (!trade._id) {
                alert("tradeId가 없습니다!");
                return;
              }
              router.push(`/trade/${trade._id}`);
            }}
            className="flex-1 py-2 rounded bg-blue-600 text-white font-bold text-base hover:bg-blue-700 ml-2"
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}

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

export default function TradeListPanel({
  tradesWithBaseItem,
  showFilterBar = true,
  itemId,
  itemMeta,
  baseItem,
  baseItems,
  trades: propTrades,
  filter,
  heightClass,
}: TradeListPanelProps) {
  const [data, setData] = useState(tradesWithBaseItem || []);
  const [showPendingOnly, setShowPendingOnly] = useState(true);
  const [sortType, setSortType] = useState<
    "latest" | "oldest" | "price-asc" | "price-desc"
  >("latest");
  const router = useRouter();
  const [selectedTrade, setSelectedTrade] = useState<{
    trade: any;
    baseItem: any;
  } | null>(null);

  // fetch trades if not provided
  useEffect(() => {
    if (propTrades) return;
    fetch(`/api/trades/all/${itemId}`)
      .then((res) => res.json())
      .then((data) => setData(data || []));
  }, [itemId, propTrades]);

  useEffect(() => {
    console.log("TradeListPanel filter prop:", filter);
  }, [filter]);

  // 기본 필터값과 현재 filter가 완전히 같으면(즉, 필터가 적용되지 않은 상태면) 전체를 보여주도록 처리
  function isDefaultFilter(filterObj: any, baseItem: any) {
    // item-filter.tsx의 getDefaultFilters와 동일하게 맞춰야 함
    if (!baseItem) return true;
    const isOthers = baseItem.type === "OTHERS";
    if (isOthers) {
      return (
        filterObj &&
        Object.keys(filterObj).length === 2 &&
        filterObj.priceMin === "0" &&
        filterObj.priceMax === "1000000000"
      );
    }
    // 장비
    const base: any = {
      priceMin: "0",
      priceMax: "1000000000",
      scrollMin: "0",
      scrollMax: (baseItem.tuc || 0).toString(),
      tucMin: "0",
      tucMax: (baseItem.tuc || 0).toString(),
    };
    if (baseItem.options) {
      Object.keys(baseItem.options).forEach((key) => {
        const value = baseItem.options?.[key] ?? 0;
        base[key + "Min"] = value.toString();
        base[key + "Max"] = value.toString();
      });
    }
    // 모든 key, value가 동일해야 함
    const keys = Object.keys(base);
    if (!filterObj) return true;
    if (Object.keys(filterObj).length !== keys.length) return false;
    for (const k of keys) {
      if (filterObj[k] !== base[k]) return false;
    }
    return true;
  }

  // TradeListPanel 내부에 아래 함수 추가
  function getTrade(t: any, isProfileMode: boolean) {
    return isProfileMode ? t.trade : t;
  }
  function getBaseItem(t: any, isProfileMode: boolean, baseItem: any) {
    return isProfileMode ? t.baseItem : baseItem;
  }

  // 정렬/필터
  const isProfileMode = !!tradesWithBaseItem;
  const filteredTrades = useMemo(() => {
    let arr = data || [];
    arr = arr.filter((t: any) =>
      isProfileMode ? t && t.trade && t.trade.createdAt : t && t.createdAt
    );
    // 필터 적용: 기본값과 다를 때만 필터링
    if (filter && !isDefaultFilter(filter, baseItem)) {
      arr = arr.filter((t: any) => {
        const trade = isProfileMode ? t.trade : t;
        const base = isProfileMode ? t.baseItem : baseItem;
        // 가격
        if (filter.priceMin && trade.itemPrice < Number(filter.priceMin))
          return false;
        if (filter.priceMax && trade.itemPrice > Number(filter.priceMax))
          return false;
        // 작횟수
        if (filter.scrollMin && trade.upgradeCount < Number(filter.scrollMin))
          return false;
        if (filter.scrollMax && trade.upgradeCount > Number(filter.scrollMax))
          return false;
        // 가능 업횟수
        if (filter.tucMin && trade.tuc < Number(filter.tucMin)) return false;
        if (filter.tucMax && trade.tuc > Number(filter.tucMax)) return false;
        // 일반 옵션 필터 (inc로 시작)
        for (const key in filter) {
          if (
            key.endsWith("Min") &&
            key !== "priceMin" &&
            key !== "scrollMin" &&
            key !== "tucMin" &&
            key.startsWith("inc")
          ) {
            const optKey = key.replace(/Min$/, "");
            if (
              trade.options &&
              filter[key] !== undefined &&
              filter[key] !== "" &&
              (trade.options[optKey] ?? 0) < Number(filter[key])
            )
              return false;
          }
          if (
            key.endsWith("Max") &&
            key !== "priceMax" &&
            key !== "scrollMax" &&
            key !== "tucMax" &&
            key.startsWith("inc")
          ) {
            const optKey = key.replace(/Max$/, "");
            if (
              trade.options &&
              filter[key] !== undefined &&
              filter[key] !== "" &&
              (trade.options[optKey] ?? 0) > Number(filter[key])
            )
              return false;
          }
        }
        // 잠재옵션 필터 (inc로 시작하지 않음)
        for (const key in filter) {
          if (key.endsWith("Min") && !key.startsWith("inc")) {
            const optKey = key.replace(/Min$/, "");
            if (
              trade.potentialOptions &&
              filter[key] !== undefined &&
              filter[key] !== "" &&
              (trade.potentialOptions[optKey] ?? 0) < Number(filter[key])
            )
              return false;
          }
          if (key.endsWith("Max") && !key.startsWith("inc")) {
            const optKey = key.replace(/Max$/, "");
            if (
              trade.potentialOptions &&
              filter[key] !== undefined &&
              filter[key] !== "" &&
              (trade.potentialOptions[optKey] ?? 0) > Number(filter[key])
            )
              return false;
          }
        }
        return true;
      });
    }
    // 정렬
    if (sortType === "latest") {
      arr = [...arr].sort((a: any, b: any) => {
        const aTime = isProfileMode
          ? new Date(a.trade.createdAt).getTime()
          : new Date(a.createdAt).getTime();
        const bTime = isProfileMode
          ? new Date(b.trade.createdAt).getTime()
          : new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
    } else if (sortType === "oldest") {
      arr = [...arr].sort((a: any, b: any) => {
        const aTime = isProfileMode
          ? new Date(a.trade.createdAt).getTime()
          : new Date(a.createdAt).getTime();
        const bTime = isProfileMode
          ? new Date(b.trade.createdAt).getTime()
          : new Date(b.createdAt).getTime();
        return aTime - bTime;
      });
    } else if (sortType === "price-asc") {
      arr = [...arr].sort((a: any, b: any) =>
        isProfileMode
          ? a.trade.itemPrice - b.trade.itemPrice
          : a.itemPrice - b.itemPrice
      );
    } else if (sortType === "price-desc") {
      arr = [...arr].sort((a: any, b: any) =>
        isProfileMode
          ? b.trade.itemPrice - a.trade.itemPrice
          : b.itemPrice - a.itemPrice
      );
    }
    return arr;
  }, [data, sortType, filter, baseItem, tradesWithBaseItem]);
  const sellTrades = filteredTrades.filter(
    (t: any) => (isProfileMode ? t.trade.type : t.type) === "SELL"
  );
  const buyTrades = filteredTrades.filter(
    (t: any) => (isProfileMode ? t.trade.type : t.type) === "BUY"
  );

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
    if (!base || !trade || !base.options) return [];
    const tags = [];
    for (const key in base.options) {
      const baseVal = base.options[key] || 0;
      const tradeVal = (trade.options && trade.options[key]) || 0;
      const diff = tradeVal - baseVal;
      const label = OPTION_TRANSLATIONS[key] || key;
      if (diff > 0) tags.push(`${label} +${diff}`);
      else if (diff < 0) tags.push(`${label} ${diff}`);
    }
    // trade.options에만 있는 추가 옵션
    if (trade.options) {
      for (const key in trade.options) {
        if (!(key in (base.options || {}))) {
          const label = OPTION_TRANSLATIONS[key] || key;
          tags.push(`${label} +${trade.options[key]}`);
        }
      }
    }
    return tags;
  }
  // 잠재옵션 태그
  function getPotentialTags(trade: any) {
    if (!trade.potentialOptions) return [];
    return Object.entries(trade.potentialOptions).map(([k, v]) => {
      const label = POTENTIAL_OPTION_TRANSLATIONS[k] || k;
      const isPercent = typeof k === "string" && k.endsWith("P");
      return `${label} +${v}${isPercent ? "%" : ""}`;
    });
  }
  // customOptions 태그
  function getCustomTags(trade: any) {
    if (!trade.customOptions) return [];
    return trade.customOptions.map((opt: any) => `${opt.label} ${opt.value}`);
  }

  const handleTradeClick = (trade: any, baseItem: any) =>
    setSelectedTrade({ trade, baseItem });
  const handleCloseModal = () => setSelectedTrade(null);

  return (
    <div className="w-full min-w-0">
      {showFilterBar && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 justify-between items-center w-full">
          <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-0">
            {/* 거래 가능한 물품만/전체 물품 토글 */}
            <button
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-colors duration-150
                ${
                  showPendingOnly
                    ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                    : "bg-gray-200 text-black dark:bg-zinc-700 dark:text-white"
                }
              `}
              onClick={() => setShowPendingOnly((v) => !v)}
            >
              {showPendingOnly ? "거래 가능한 물품만" : "전체 물품"}
            </button>
            {/* 최신순/오래된순 토글 */}
            <button
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-colors duration-150
                ${
                  sortType === "latest"
                    ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                    : "bg-gray-200 text-black dark:bg-zinc-700 dark:text-white"
                }
              `}
              onClick={() =>
                setSortType(sortType === "latest" ? "oldest" : "latest")
              }
            >
              {sortType === "latest" ? "최신순" : "오래된순"}
            </button>
            {/* 가격순(위/아래 화살표) 토글 */}
            <button
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-colors duration-150
                ${
                  sortType === "price-asc" || sortType === "price-desc"
                    ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                    : "bg-gray-200 text-black dark:bg-zinc-700 dark:text-white"
                }
              `}
              onClick={() =>
                setSortType(
                  sortType === "price-asc" ? "price-desc" : "price-asc"
                )
              }
            >
              가격순{sortType === "price-asc" ? "▼" : " ▲"}
            </button>
          </div>
          <button
            className="px-4 py-1.5 rounded-lg font-bold text-sm transition-colors duration-150 bg-blue-600 text-white dark:bg-blue-500 dark:text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            onClick={() => router.push(`/trade/register/${itemId}`)}
          >
            아이템 등록
          </button>
        </div>
      )}
      <div
        className={`flex flex-col sm:flex-row gap-2 sm:gap-4 w-full ${
          heightClass || "h-[700px] max-h-[700px]"
        }`}
      >
        {/* 팝니다 */}
        <div className="flex-1 bg-white dark:bg-[#181c23] rounded-lg p-2 flex flex-col min-w-0 sm:min-w-[320px] sm:max-w-[500px] border border-gray-300 dark:border-zinc-700 mb-2 sm:mb-0">
          <div
            className="font-bold mb-2 text-white text-left text-lg px-4 py-2 rounded-t-lg"
            style={{ background: "#274a84" }}
          >
            팝니다
          </div>
          <div className="flex-1 overflow-y-auto">
            {sellTrades.length === 0 && (
              <div className="text-gray-300 text-center">
                등록된 팝니다가 없습니다.
              </div>
            )}
            {sellTrades.map((t, i) => {
              const trade = getTrade(t, isProfileMode);
              const base = getBaseItem(t, isProfileMode, baseItem);
              const itemIdToUse = base?.itemId ?? trade.itemId ?? 0;
              const itemMetaToUse = base ?? {};
              const typeToUse = trade.itemType || base?.type;
              return (
                <div
                  key={trade._id}
                  className="rounded-lg bg-gray-100 dark:bg-[#23272f] p-1 mb-1 flex flex-col gap-0 shadow border border-gray-200 dark:border-[#2e3a4d] text-xs sm:text-[13px] cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  onClick={() => handleTradeClick(trade, base)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      {typeToUse === "EQUIP" ? (
                        <Popover
                          content={
                            <TradeEquipDetailBody
                              item={base}
                              trade={trade}
                              cardSize={320}
                            />
                          }
                        >
                          <ItemIcon
                            id={itemIdToUse}
                            size={32}
                            disableDarkBg={true}
                          />
                        </Popover>
                      ) : typeToUse === "OTHERS" ? (
                        <ItemIcon
                          id={itemIdToUse}
                          size={32}
                          disableDarkBg={true}
                        />
                      ) : (
                        <ItemIcon
                          id={itemIdToUse}
                          size={32}
                          disableDarkBg={true}
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-semibold text-[13px] text-black dark:text-white truncate">
                        {itemMetaToUse.name}
                      </span>
                      <span className="font-semibold text-[13px] flex items-center gap-1 leading-tight text-black dark:text-white">
                        <span className="flex items-center gap-1">
                          {trade.itemPrice?.toLocaleString?.() ??
                            trade.itemPrice ??
                            "-"}
                          <img
                            src="/meso.png"
                            alt="메소"
                            style={{
                              width: 16,
                              height: 16,
                              display: "inline-block",
                            }}
                          />
                        </span>
                        {shouldShowCoin(trade.coin) && (
                          <span className="flex items-center gap-1">
                            <span className="text-gray-500 font-bold">or</span>
                            {(() => {
                              const { g, s, b } = parseCoinString(trade.coin);
                              return (
                                <span className="flex items-center gap-1">
                                  {g > 0 && (
                                    <>
                                      <img
                                        src="/goldCoin.png"
                                        alt="Gold"
                                        className="w-4 h-4 inline-block"
                                      />
                                      {g}
                                    </>
                                  )}
                                  {s > 0 && (
                                    <>
                                      <img
                                        src="/silverCoin.png"
                                        alt="Silver"
                                        className="w-4 h-4 inline-block"
                                      />
                                      {s}
                                    </>
                                  )}
                                  {b > 0 && (
                                    <>
                                      <img
                                        src="/bronzeCoin.png"
                                        alt="Bronze"
                                        className="w-4 h-4 inline-block"
                                      />
                                      {b}
                                    </>
                                  )}
                                </span>
                              );
                            })()}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        {trade.quantity ? `${trade.quantity}개` : "1개"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center ml-2">
                      <span className="text-xs text-gray-400 whitespace-nowrap mb-0">
                        {getTimeAgo(trade.createdAt)}
                      </span>
                      <img
                        src={getDiscordAvatarUrl(
                          trade.userDiscordId,
                          trade.userAvatar,
                          i
                        )}
                        className="w-5 h-5 rounded-full"
                        alt="avatar"
                      />
                      <span className="text-xs truncate mt-0">
                        {trade.userGlobalName}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-0.5 mt-0 group">
                    {typeToUse !== "OTHERS" && base && (
                      <>
                        {getOptionTags(base, trade).map(
                          (tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-blue-600 dark:bg-blue-700 text-white text-[11px] px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          )
                        )}
                        {getPotentialTags(trade).map(
                          (tag: string, idx: number) => (
                            <span
                              key={"potential-" + idx}
                              className="bg-purple-600 dark:bg-purple-700 text-white text-[11px] px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          )
                        )}
                        {getCustomTags(trade).map(
                          (tag: string, idx: number) => (
                            <span
                              key={"custom-" + idx}
                              className="bg-purple-600 dark:bg-purple-700 text-white text-[11px] px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          )
                        )}
                        <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded">
                          {trade.upgradeCount} 작
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded">
                          업횟 {trade.tuc}
                        </span>
                      </>
                    )}
                    <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded">
                      {trade.tradeWorld}
                    </span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded">
                      흥정
                      {trade.haggling === "POSSIBLE"
                        ? "가능"
                        : trade.haggling === "IMPOSSIBLE"
                        ? "불가"
                        : "제안받음"}
                    </span>
                    {trade.comment && (
                      <span className="relative bg-gray-200 dark:bg-zinc-800 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded truncate max-w-[120px]">
                        {trade.comment}
                        <span className="absolute left-1/2 -translate-x-1/2 -top-2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150 flex flex-col items-center">
                          <span className="mt-[-40px] bg-white dark:bg-zinc-900 text-black dark:text-white text-sm px-4 py-2 rounded shadow-lg border border-gray-200 dark:border-zinc-700 whitespace-pre-line max-w-xs min-w-[180px] break-words">
                            {trade.comment}
                          </span>
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 삽니다 */}
        <div className="flex-1 bg-white dark:bg-[#181c23] rounded-lg p-2 flex flex-col min-w-0 sm:min-w-[320px] sm:max-w-[500px] border border-gray-300 dark:border-zinc-700">
          <div
            className="font-bold mb-2 text-white text-left text-lg px-4 py-2 rounded-t-lg"
            style={{ background: "#1a6c38" }}
          >
            삽니다
          </div>
          <div className="flex-1 overflow-y-auto">
            {buyTrades.length === 0 && (
              <div className="text-gray-300 text-center">
                등록된 삽니다가 없습니다.
              </div>
            )}
            {buyTrades.map((t, i) => {
              const trade = getTrade(t, isProfileMode);
              const base = getBaseItem(t, isProfileMode, baseItem);
              const itemIdToUse = base?.itemId ?? trade.itemId ?? 0;
              const itemMetaToUse = base ?? {};
              const typeToUse = trade.itemType || base?.type;
              return (
                <div
                  key={trade._id}
                  className="rounded-lg bg-gray-100 dark:bg-[#23272f] p-1 mb-1 flex flex-col gap-0 shadow border border-gray-200 dark:border-[#2e3a4d] text-xs sm:text-[13px] cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  onClick={() => handleTradeClick(trade, base)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      {typeToUse === "EQUIP" ? (
                        <Popover
                          content={
                            <TradeEquipDetailBody
                              item={base}
                              trade={trade}
                              cardSize={320}
                            />
                          }
                        >
                          <ItemIcon
                            id={itemIdToUse}
                            size={32}
                            disableDarkBg={true}
                          />
                        </Popover>
                      ) : typeToUse === "OTHERS" ? (
                        <ItemIcon
                          id={itemIdToUse}
                          size={32}
                          disableDarkBg={true}
                        />
                      ) : (
                        <ItemIcon
                          id={itemIdToUse}
                          size={32}
                          disableDarkBg={true}
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-semibold text-[13px] text-black dark:text-white truncate">
                        {itemMetaToUse.name}
                      </span>
                      <span className="font-semibold text-[13px] flex items-center gap-1 leading-tight text-black dark:text-white">
                        <span className="flex items-center gap-1">
                          {trade.itemPrice?.toLocaleString?.() ??
                            trade.itemPrice ??
                            "-"}
                          <img
                            src="/meso.png"
                            alt="메소"
                            style={{
                              width: 16,
                              height: 16,
                              display: "inline-block",
                            }}
                          />
                        </span>
                        {shouldShowCoin(trade.coin) && (
                          <span className="flex items-center gap-1">
                            <span className="text-gray-500 font-bold">or</span>
                            {(() => {
                              const { g, s, b } = parseCoinString(trade.coin);
                              return (
                                <span className="flex items-center gap-1">
                                  {g > 0 && (
                                    <>
                                      <img
                                        src="/goldCoin.png"
                                        alt="Gold"
                                        className="w-4 h-4 inline-block"
                                      />
                                      {g}
                                    </>
                                  )}
                                  {s > 0 && (
                                    <>
                                      <img
                                        src="/silverCoin.png"
                                        alt="Silver"
                                        className="w-4 h-4 inline-block"
                                      />
                                      {s}
                                    </>
                                  )}
                                  {b > 0 && (
                                    <>
                                      <img
                                        src="/bronzeCoin.png"
                                        alt="Bronze"
                                        className="w-4 h-4 inline-block"
                                      />
                                      {b}
                                    </>
                                  )}
                                </span>
                              );
                            })()}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        {trade.quantity ? `${trade.quantity}개` : "1개"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center ml-2">
                      <span className="text-xs text-gray-400 whitespace-nowrap mb-0">
                        {getTimeAgo(trade.createdAt)}
                      </span>
                      <img
                        src={getDiscordAvatarUrl(
                          trade.userDiscordId,
                          trade.userAvatar,
                          i
                        )}
                        className="w-5 h-5 rounded-full"
                        alt="avatar"
                      />
                      <span className="text-xs truncate mt-0">
                        {trade.userGlobalName}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-0.5 mt-0 group">
                    {typeToUse !== "OTHERS" && base && (
                      <>
                        {getOptionTags(base, trade).map(
                          (tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-blue-600 dark:bg-blue-700 text-white text-[11px] px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          )
                        )}
                        {getPotentialTags(trade).map(
                          (tag: string, idx: number) => (
                            <span
                              key={"potential-" + idx}
                              className="bg-purple-600 dark:bg-purple-700 text-white text-[11px] px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          )
                        )}
                        {getCustomTags(trade).map(
                          (tag: string, idx: number) => (
                            <span
                              key={"custom-" + idx}
                              className="bg-purple-600 dark:bg-purple-700 text-white text-[11px] px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          )
                        )}
                        <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded">
                          {trade.upgradeCount} 작
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded">
                          업횟 {trade.tuc}
                        </span>
                      </>
                    )}
                    <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded">
                      {trade.tradeWorld}
                    </span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded">
                      흥정
                      {trade.haggling === "POSSIBLE"
                        ? "가능"
                        : trade.haggling === "IMPOSSIBLE"
                        ? "불가"
                        : "제안받음"}
                    </span>
                    {trade.comment && (
                      <span className="relative bg-gray-200 dark:bg-zinc-800 text-black dark:text-white text-[11px] px-1.5 py-0.5 rounded truncate max-w-[120px]">
                        {trade.comment}
                        <span className="absolute left-1/2 -translate-x-1/2 -top-2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150 flex flex-col items-center">
                          <span className="mt-[-40px] bg-white dark:bg-zinc-900 text-black dark:text-white text-sm px-4 py-2 rounded shadow-lg border border-gray-200 dark:border-zinc-700 whitespace-pre-line max-w-xs min-w-[180px] break-words">
                            {trade.comment}
                          </span>
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* 거래 상세 모달 */}
      {selectedTrade && selectedTrade.trade && (
        <TradeDetailModal
          trade={selectedTrade.trade}
          baseItem={selectedTrade.baseItem}
          onClose={handleCloseModal}
          getOptionTags={getOptionTags}
          getPotentialTags={getPotentialTags}
          getCustomTags={getCustomTags}
        />
      )}
      <style jsx global>{`
        @keyframes fadein-slide {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(30px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadein-slide {
          animation: fadein-slide 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1 !important;
          transform: scale(1) translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
