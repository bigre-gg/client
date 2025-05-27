"use client";
import Link from "next/link";

export default function NoticeLoginPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* 상단: 공지사항으로 돌아가기 */}
      <div className="mb-6">
        <Link
          href="/notice"
          className="text-blue-600 hover:underline font-semibold"
        >
          ← 공지사항
        </Link>
      </div>
      {/* 큰 제목 */}
      <h1 className="text-2xl font-bold mb-2">디스코드 관련 안내</h1>
      <hr className="mb-10 border-gray-300 dark:border-zinc-700" />

      <ul className="list-disc ml-6 mb-8 space-y-2 text-base">
        <li>구매하기 버튼 클릭 후 유저 프로필이 뜨지 않는 경우</li>
      </ul>

      <div className="mb-6">
        <a
          href="https://discord.com/invite/3JK75V97pW"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-semibold"
        >
          https://discord.com/invite/3JK75V97pW
        </a>
      </div>

      <div className="mb-8">
        <img
          src="/notice/discord/1.png"
          alt="디스코드 초대 수락 안내"
          className="w-full max-w-[500px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto"
        />
      </div>

      <div className="text-base">
        <span className="font-semibold"></span>
        <br />
        위와 같이{" "}
        <span className="font-semibold">빅뱅리턴즈 디스코드 서버</span>에 참여
        후 다시 거래를 시도해보세요!
      </div>
    </div>
  );
}
