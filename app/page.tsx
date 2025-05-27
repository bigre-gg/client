import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SearchBox from "./ui/search-box";
import Image from "next/image";

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
    </main>
  );
}
