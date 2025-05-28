import React from "react";

export default function TradeManageNoticePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">거래 관리 안내</h1>
      <div className="mb-8 text-center">
        <span className="font-semibold text-red-600 dark:text-red-400 text-base">
          거래 후에는 반드시 거래를 완료 처리해주세요
        </span>
      </div>

      {/* 1. 거래 수정 방법(1~4단계) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">1. 거래 관리 진입</h2>
        <div className="space-y-8">
          <div>
            <h3 className="font-bold mb-2">
              1) 화면 우측 상단의 디스코드 아이콘 클릭
            </h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/1.png"
                alt="디스코드 아이콘 클릭"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">
              2) 프로필 클릭하여 내 프로필 화면으로 이동
            </h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/2.png"
                alt="프로필 클릭"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">
              3) 진행중인 거래에서 수정할 아이템 클릭
            </h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/3.png"
                alt="진행중 거래 아이템 클릭"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">4) 관리 버튼 클릭</h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/4.png"
                alt="관리 버튼 클릭"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="my-8 border-gray-400 dark:border-zinc-700" />

      {/* 2. 거래 완료 처리 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">2. 거래 완료 처리</h2>
        <div className="space-y-8">
          <div>
            <h3 className="font-bold mb-2">
              1) 관리 패널에서 거래 완료 버튼 클릭
            </h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/5.png"
                alt="관리 패널"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">2) 거래 완료 버튼 확인</h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/7.png"
                alt="거래 완료 버튼 클릭"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">3) 거래 완료</h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/8.png"
                alt="거래 완료"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="my-8 border-gray-400 dark:border-zinc-700" />

      {/* 3. 거래 수정(5~6단계) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">3. 거래 정보 수정</h2>
        <div className="space-y-8">
          <div>
            <h3 className="font-bold mb-2">1) 관리 패널에서 수정 버튼 클릭</h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/5.png"
                alt="관리 패널"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">2) 원하는 정보 수정 후 저장</h3>
            <div className="flex justify-center mb-2">
              <img
                src="/notice/trade-manage/6.png"
                alt="수정 버튼 클릭"
                className="object-contain max-w-full max-h-[400px] sm:max-h-[500px] rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
