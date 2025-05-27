"use client";
import Link from "next/link";

export default function NoticeAskPage() {
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
      <h1 className="text-2xl font-bold mb-2">문의/신고 관련 안내</h1>
      <hr className="mb-10 border-gray-300 dark:border-zinc-700" />

      <div className="mb-8 text-base">
        카카오톡 채널을 통해 문의/신고를 받고 있습니다. 1대1 채팅으로 불편함을
        말씀해주세요.
      </div>
      <div className="mb-8 text-base">
        주로 아래 내용과 관련된 문의/신고를 해주시면 감사하겠습니다.
      </div>
      <ul className="list-disc ml-6 mb-10 space-y-2 text-base">
        <li>아이템 정보 오류 제보</li>
        <li>사이트 오류 제보</li>
        <li>유저 신고하기</li>
      </ul>

      {/* 사진1 */}
      <div className="mb-10">
        <img
          src="/notice/ask/1.png"
          alt="카카오톡 문의 안내 1"
          className="w-full max-w-[500px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto"
        />
      </div>

      {/* 사진2 + 카카오톡 문의 링크 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
        <img
          src="/notice/ask/2.png"
          alt="카카오톡 문의 안내 2"
          className="w-full max-w-[220px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
        />
        <a
          href="https://pf.kakao.com/_AxfaSn/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-semibold text-lg"
        >
          카카오톡 문의
        </a>
      </div>
    </div>
  );
}
