"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TradeEquipDetailBody from "@/app/ui/TradeEquipDetailBody";
import ItemDetailBody from "@/app/ui/item-detail-body";
import NonEquipItemDetail from "@/app/ui/NonEquipItemDetail";
import { getItemById, ItemApiResponse } from "@/lib/items";
import { OPTION_TRANSLATIONS } from "@/app/ui/TradeListPanel";
import UserProfileCard from "@/app/ui/UserProfileCard";

// 코인 문자열 파싱 함수 (TradeListPanel과 동일)
function parseCoinString(coinStr?: string) {
  if (!coinStr) return { g: 0, s: 0, b: 0 };
  const match = coinStr.match(/(\d+)g(\d+)s(\d+)b/);
  if (!match) return { g: 0, s: 0, b: 0 };
  return { g: Number(match[1]), s: Number(match[2]), b: Number(match[3]) };
}
function shouldShowCoin(coinStr?: string) {
  if (!coinStr) return false;
  const { g, s, b } = parseCoinString(coinStr);
  return g > 0 || s > 0 || b > 0;
}
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

// 옵션 태그 생성 함수
function getOptionTags(base: any, trade: any) {
  if (!base || !trade) return [];
  const tags = [];
  for (const key in base.options) {
    const baseVal = base.options[key] || 0;
    const tradeVal = (trade.options && trade.options[key]) || 0;
    const diff = tradeVal - baseVal;
    const label = OPTION_TRANSLATIONS[key] || key;
    if (diff > 0) tags.push(`${label} +${diff}`);
    else if (diff < 0) tags.push(`${label} ${diff}`);
  }
  for (const key in trade.options) {
    if (!(key in base.options)) {
      const label = OPTION_TRANSLATIONS[key] || key;
      tags.push(`${label} +${trade.options[key]}`);
    }
  }
  return tags;
}
function getPotentialTags(trade: any) {
  if (!trade.potentialOptions) return [];
  return Object.entries(trade.potentialOptions).map(([k, v]) => {
    const label = POTENTIAL_OPTION_TRANSLATIONS[k] || k;
    const isPercent = typeof k === "string" && k.endsWith("P");
    return `${label} +${v}${isPercent ? "%" : ""}`;
  });
}
function getCustomTags(trade: any) {
  if (!trade.customOptions) return [];
  return trade.customOptions.map((opt: any) => `${opt.label} ${opt.value}`);
}

export default function TradeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [trade, setTrade] = useState<any>(null);
  const [baseItem, setBaseItem] = useState<ItemApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTrades, setUserTrades] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchTrade() {
      setLoading(true);
      try {
        const res = await fetch(`/api/trades/${id}`);
        if (!res.ok) throw new Error("거래 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setTrade(data);
        // 아이템 정보도 별도 fetch 필요시 추가
        const itemRes = await getItemById(String(data.itemId));
        setBaseItem(itemRes);
        // 유저 거래목록
        if (data.userDiscordId) {
          const tradesRes = await fetch(
            `/api/trades/user/${data.userDiscordId}`
          );
          if (tradesRes.ok) setUserTrades(await tradesRes.json());
        }
        // 유저 정보(status API)
        const statusRes = await fetch("/api/auth/status", {
          credentials: "include",
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setUser(statusData.user);
        }
      } catch (e) {
        alert("상세 정보를 불러오지 못했습니다.");
        // router.push("/trade"); // 이동하지 않음
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTrade();
  }, [id, router]);

  if (loading)
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-lg">
        로딩 중...
      </div>
    );
  if (!trade)
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-lg">
        존재하지 않는 거래입니다.
      </div>
    );

  // 등록일(유저 가입일)
  const userCreatedAt = user?.createdAt ? new Date(user.createdAt) : null;
  const userCreatedAtStr = userCreatedAt
    ? `${userCreatedAt.getFullYear()}.${
        userCreatedAt.getMonth() + 1
      }.${userCreatedAt.getDate()} ${userCreatedAt.getHours()}:${userCreatedAt
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : "-";
  // 거래 등록일
  const tradeCreatedAt = trade.createdAt ? new Date(trade.createdAt) : null;
  const tradeCreatedAtStr = tradeCreatedAt
    ? `${tradeCreatedAt.getFullYear()}.${
        tradeCreatedAt.getMonth() + 1
      }.${tradeCreatedAt.getDate()} ${tradeCreatedAt.getHours()}:${tradeCreatedAt
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : "-";

  // 가격/태그 정보
  const priceStr = trade.itemPrice
    ? `${trade.itemPrice.toLocaleString()} 메소`
    : "-";
  const coinStr = trade.coin ? trade.coin : null;
  const hagglingStr =
    trade.haggling === "POSSIBLE"
      ? "흥정 가능"
      : trade.haggling === "IMPOSSIBLE"
      ? "흥정 불가"
      : "제안 받음";
  const worldStr = trade.tradeWorld || "-";
  const statusStr =
    trade.status === "COMPLETED"
      ? "거래완료"
      : trade.status === "CANCELLED"
      ? "취소됨"
      : "진행중";

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mx-auto py-2 px-2">
      {/* 좌측: 유저 프로필 */}
      <div className="self-start">
        <UserProfileCard
          user={user}
          onReport={() => alert("신고 기능은 준비 중입니다.")}
          onProfileClick={() => {
            const userId = user?.userId || user?.discordId;
            if (userId) router.push(`/profile/${userId}`);
          }}
        />
      </div>
      {/* 우측: 거래 상세 */}
      <div className="flex-1 bg-white dark:bg-[#23272f] rounded-2xl shadow p-6 border border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center">
        {/* 거래시 주의사항 안내 - 팝니다/삽니다 위쪽 */}
        <div className="w-full flex justify-start mb-4">
          <div className="bg-yellow-100 text-yellow-800 text-xs font-bold rounded px-3 py-1 shadow">
            거래시 사기, 개인정보 유출 등에 주의하세요. 안전한 거래를 위해
            반드시 디스코드 내에서만 연락하고, 의심스러운 링크나 파일은 클릭하지
            마세요.
          </div>
        </div>
        {/* 팝니다/삽니다 뱃지 + 등록일 */}
        <div className="w-full flex items-center gap-1 mb-2 justify-start">
          <span
            className={`font-bold text-base px-3 py-1 rounded-xl ${
              trade.type === "SELL"
                ? "bg-blue-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {trade.type === "SELL" ? "팝니다" : "삽니다"}
          </span>
          <span className="text-xs text-gray-400">{tradeCreatedAtStr}</span>
        </div>
        <div className="relative flex flex-col items-center mt-8">
          {trade && trade.itemType === "EQUIP"
            ? baseItem && (
                <TradeEquipDetailBody
                  item={baseItem}
                  trade={trade}
                  cardSize={320}
                  readOnly
                />
              )
            : trade && trade.itemType === "OTHERS"
            ? baseItem && (
                <NonEquipItemDetail
                  itemId={baseItem.itemId}
                  name={baseItem.name}
                  description={(baseItem as any).description ?? ""}
                  cardSize={320}
                />
              )
            : baseItem && <ItemDetailBody item={baseItem} cardSize={320} />}
        </div>
        {/* 거래 정보 카드 (TradeListPanel 모달 스타일) */}
        <div className="mt-6 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#23272f] rounded-xl p-4 shadow border border-gray-700 max-w-xs mx-auto w-full relative">
          {/* 가격/코인/수량 */}
          <div className="flex flex-col items-center mb-2">
            <span className="font-bold text-lg flex items-center gap-1">
              {trade.itemPrice?.toLocaleString() || "-"}
              <img
                src="/meso.png"
                alt="메소"
                className="w-5 h-5 inline-block"
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
          {/* 태그들 */}
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
            {trade.upgradeCount !== undefined && (
              <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[15px] px-2 py-1 rounded">
                {trade.upgradeCount} 작
              </span>
            )}
            {trade.tuc !== undefined && (
              <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[15px] px-2 py-1 rounded">
                업횟 {trade.tuc}
              </span>
            )}
            {trade.tradeWorld && (
              <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[15px] px-2 py-1 rounded">
                {trade.tradeWorld}
              </span>
            )}
            <span className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-[15px] px-2 py-1 rounded">
              {trade.haggling === "IMPOSSIBLE"
                ? "흥정 불가"
                : trade.haggling === "POSSIBLE"
                ? "흥정 가능"
                : "제안 받음"}
            </span>
          </div>
          {/* 복사 가능한 문구와 버튼 */}
          <div className="w-full flex flex-col items-center mt-4">
            <div className="flex w-full gap-2">
              <input
                type="text"
                className="flex-1 px-2 py-1 rounded bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-zinc-600 text-sm"
                value={`@${trade.username || trade.userGlobalName} ${
                  baseItem?.name || trade.itemName || "아이템"
                } ${trade.itemPrice?.toLocaleString() || "-"}${
                  trade.type === "SELL" ? "에 구매합니다." : "에 판매합니다."
                }`}
                readOnly
                id="copyTradeText"
              />
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
                onClick={() => {
                  const text = document.getElementById("copyTradeText");
                  if (text && "value" in text) {
                    navigator.clipboard.writeText(
                      (text as HTMLInputElement).value
                    );
                  }
                }}
              >
                복사
              </button>
            </div>
            {/* 디스코드로 연락하기 버튼 */}
            <div className="w-full flex justify-center mt-2 gap-2">
              <a
                href={`https://discord.com/users/${
                  user?.userId || trade.userDiscordId
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded bg-[#5865F2] text-white font-bold text-sm hover:bg-[#4752C4]"
              >
                디스코드(웹)
              </a>
              <a
                href={`discord://-/users/${
                  user?.userId || trade.userDiscordId
                }`}
                className="px-4 py-2 rounded bg-[#5865F2] text-white font-bold text-sm hover:bg-[#4752C4]"
              >
                디스코드(PC앱)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
