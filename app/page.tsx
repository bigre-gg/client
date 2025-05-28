"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SearchBox from "./ui/search-box";
import Image from "next/image";
import { useEffect, useState } from "react";
import ItemIcon from "./ui/ItemIcon";
import items from "../public/items.json";
import { useRouter } from "next/navigation";

const MAIN_ITEM_IDS = [
  103, 2049100, 300, 200, 2049401, 2049500, 2460003, 2460002, 2460001, 2460000,
];

function getItemMeta(id: number) {
  return items.find((item: any) => item.id === id);
}

function MainItemList() {
  const router = useRouter();
  return (
    <div className="w-full max-w-[320px] mx-auto flex flex-col gap-0 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
      {MAIN_ITEM_IDS.map((id) => {
        const meta = getItemMeta(id);
        if (!meta) return null;
        return (
          <div
            key={id}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-zinc-700 last:border-b-0 transition-colors"
            onClick={() => router.push(`/item/${id}`)}
          >
            <ItemIcon id={id} size={32} />
            <span className="ml-2">{meta.name}</span>
            <ArrowRightIcon className="w-4 h-4 ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition" />
          </div>
        );
      })}
    </div>
  );
}

function PopularItemList() {
  const [popular, setPopular] = useState<{ itemId: number; count: number }[]>(
    []
  );
  const router = useRouter();
  useEffect(() => {
    fetch("/api/trades/popular")
      .then((res) => res.json())
      .then((data) => setPopular(data));
  }, []);
  return (
    <div className="w-full max-w-[320px] mx-auto flex flex-col gap-0 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
      {popular.map(({ itemId, count }) => {
        const meta = getItemMeta(itemId);
        if (!meta) return null;
        return (
          <div
            key={itemId}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-zinc-700 last:border-b-0 transition-colors"
            onClick={() => router.push(`/item/${itemId}`)}
          >
            <ItemIcon id={itemId} size={32} />
            <span className="ml-2">{meta.name}</span>
            <span className="text-xs text-gray-400 ml-2">{count}회</span>
            <ArrowRightIcon className="w-4 h-4 ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition" />
          </div>
        );
      })}
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-lightBg dark:bg-darkBg text-darkBg dark:text-lightBg flex flex-col items-center">
      <Image
        src="/logo.png"
        width={200}
        height={100}
        alt="로고"
        className="mx-auto mt-12 mb-6"
      />
      <SearchBox />
      <Link
        href="/notice"
        className="block mt-10 rounded-lg border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-4 shadow hover:shadow-lg hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-yellow-500 text-xl font-bold">
            ⚠️ 필독 가이드
          </span>
          <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
            원활한 빅리지지 이용을 위한 필독 가이드
          </span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          거래/이용 규칙, 신고/문의 안내 등 꼭 확인하세요!
        </div>
      </Link>
      {/* 주요/인기 아이템 리스트 */}
      <div className="w-full flex flex-col md:flex-row gap-2 justify-center items-start mt-10">
        <div className="flex-1 flex flex-col items-center">
          <div className="font-extrabold text-lg mb-4 text-blue-700 dark:text-blue-200 tracking-tight border-b-2 border-blue-200 dark:border-blue-800 pb-1 w-full max-w-[320px] text-left">
            주요 아이템
          </div>
          <MainItemList />
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="font-extrabold text-lg mb-4 text-yellow-700 dark:text-yellow-200 tracking-tight border-b-2 border-yellow-200 dark:border-yellow-800 pb-1 w-full max-w-[320px] text-left">
            인기 아이템
          </div>
          <PopularItemList />
        </div>
      </div>
    </main>
  );
}
