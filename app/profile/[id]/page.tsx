"use client";
import { useEffect, useState } from "react";
import UserProfileCard from "@/app/ui/UserProfileCard";
import TradeListPanel from "@/app/ui/TradeListPanel";
import { useParams, useRouter } from "next/navigation";
import { ItemApiResponse } from "@/app/ui/EditableItemDetailBody";
import { getItemById } from "@/lib/items";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tradeWithBaseItems, setTradeWithBaseItems] = useState<any[]>([]);
  const [myDiscordId, setMyDiscordId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrade() {
      setLoading(true);
      try {
        // 내 디스코드 ID fetch
        const statusRes = await fetch("/api/auth/status", {
          credentials: "include",
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setMyDiscordId(statusData.user?.discordId || null);
        }
        // 유저 정보 fetch (id 기준)
        const userRes = await fetch(`/api/users/${id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
        // 유저 거래목록 fetch
        const tradesRes = await fetch(`/api/trades/users/${id}`);
        if (tradesRes.ok) {
          const trades = await tradesRes.json();
          // 각 거래의 baseItem을 병렬로 fetch
          const baseItems = await Promise.all(
            trades.map((trade: any) => getItemById(String(trade.itemId)))
          );
          // trade와 baseItem을 묶어서 저장
          const merged = trades.map((trade: any, idx: number) => ({
            trade,
            baseItem: baseItems[idx],
          }));
          setTradeWithBaseItems(merged);
        }
      } catch (e) {
        alert("상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTrade();
  }, [id]);

  const isMyProfile = myDiscordId && user && myDiscordId === user.discordId;

  const pendingTrades = tradeWithBaseItems.filter(
    (t: any) => t.trade.status === "PENDING"
  );
  const completedTrades = tradeWithBaseItems.filter(
    (t: any) => t.trade.status === "COMPLETED"
  );

  if (loading)
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-lg">
        로딩 중...
      </div>
    );
  if (!user)
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-lg">
        유저 정보를 불러올 수 없습니다.
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto py-8 px-2">
      {/* 좌측: 유저 프로필 */}
      <div className="w-full md:w-80">
        {user && (
          <UserProfileCard
            user={user}
            onReport={() => alert("신고 기능은 준비 중입니다.")}
            onProfileClick={() => {
              const userId = user?.userId || user.discordId;
              if (userId) router.push(`/profile/${userId}`);
            }}
          />
        )}
      </div>
      {/* 우측: 거래 리스트 */}
      <div className="flex-1 flex flex-col gap-8">
        {/* 안내 문구 카드 */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl bg-blue-50 dark:bg-zinc-800 border border-blue-200 dark:border-zinc-700 rounded-xl shadow px-6 py-4 mb-2 text-center">
            <span className="font-semibold text-blue-700 dark:text-blue-300 text-base">
              거래 전, 후에 반드시
              <a
                href="/notice/trade-manage"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                가이드의 지침
              </a>
              을 따라주세요.
            </span>
          </div>
        </div>
        {/* 진행중 거래 패널 */}
        <div>
          <div className="font-bold text-lg mb-2">진행중 거래</div>
          <TradeListPanel
            tradesWithBaseItem={pendingTrades}
            showFilterBar={false}
            heightClass="h-[400px] max-h-[400px]"
            isMyProfile={isMyProfile}
            disablePendingFilter={true}
          />
        </div>
        {/* 완료된 거래 패널 */}
        <div>
          <div className="font-bold text-lg mb-2">완료된 거래</div>
          <TradeListPanel
            tradesWithBaseItem={completedTrades}
            showFilterBar={false}
            heightClass="h-[400px] max-h-[400px]"
            isMyProfile={isMyProfile}
            disablePendingFilter={true}
          />
        </div>
      </div>
    </div>
  );
}
