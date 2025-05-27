"use client";
import Link from "next/link";

export default function NoticeTradePage() {
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
      <h1 className="text-2xl font-bold mb-2">거래 관련 안내</h1>
      <hr className="mb-10 border-gray-300 dark:border-zinc-700" />

      {/* 1. 팝니다 등록 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">1. 아이템 거래 등록</h2>
        <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
        <ol className="list-decimal ml-6 space-y-6">
          <li>
            아이템을 검색한 후 특정 아이템을 클릭하여 거래 목록 페이지로 이동
            <div className="mt-2">
              <img
                src="/notice/trade/1.png"
                alt="거래 안내 1"
                className="w-full max-w-[500px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
              />
            </div>
            <div className="mt-2">
              <img
                src="/notice/trade/2.png"
                alt="거래 안내 2"
                className="w-full max-w-[900px] max-h-[800px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
              />
            </div>
            <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
          </li>
          <li>
            거래 목록 페이지에서 아이템 등록 버튼 클릭
            <img
              src="/notice/trade/3.png"
              alt="거래 안내 3"
              className="w-full max-w-[500px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
            <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
          </li>
          <li>
            아이템 옵션이나 (장비 아이템) 세부 옵션 (가격, 수량 등등)을 입력하고
            등록하기 버튼 클릭
            <img
              src="/notice/trade/4.png"
              alt="거래 안내 4"
              className="w-full max-w-[900px] max-h-[800px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
            <img
              src="/notice/trade/5.png"
              alt="거래 안내 5"
              className="w-full max-w-[900px] max-h-[800px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
            <div className="text-xs text-red-500 mt-2">
              (옵션을 허위로 입력한 사실이 발각 될 경우, 경고 없는 이용 제한
              조치를 받을 수 있습니다.)
            </div>
            <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
          </li>
          <li>
            아이템 등록 후 디스코드 연락을 기다려주세요.
            <img
              src="/notice/trade/6.png"
              alt="거래 안내 6"
              className="w-full max-w-[900px] max-h-[800px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
          </li>
        </ol>
      </section>

      <hr className="mb-10 border-gray-300 dark:border-zinc-700" />

      {/* 2. 아이템 거래 연락 (디스코드) */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">
          2. 아이템 거래 연락 (디스코드)
        </h2>
        <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
        <ol className="list-decimal ml-6 space-y-6">
          <li>
            거래 목록에서 구매 또는 판매할 아이템을 클릭
            <img
              src="/notice/trade/7.png"
              alt="거래 안내 7"
              className="w-full max-w-[900px] max-h-[800px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
            <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
          </li>
          <li>
            구매하기 버튼을 클릭하여 상세 정보 페이지로 이동
            <img
              src="/notice/trade/8.png"
              alt="거래 안내 8"
              className="w-full max-w-[900px] max-h-[800px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
            <div className="text-xs text-500 mt-2">
              (아이템 옵션과 가격을 잘 확인해 주세요)
            </div>
            <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
          </li>
          <li>
            아이템 옵션 밑 메세지 복사 후 디스코드 버튼 클릭
            <img
              src="/notice/trade/9.png"
              alt="거래 안내 9"
              className="w-full max-w-[500px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
            <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
          </li>
          <li>
            디스코드 창이 열리면 친구 추가하기 좌측의 말풍선을 클릭
            <img
              src="/notice/trade/10.png"
              alt="거래 안내 10"
              className="w-full max-w-[500px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
            <hr className="my-4 mb-10 border-gray-200 dark:border-zinc-700" />
          </li>
          <li>
            복사된 메세지를 붙여넣기 한 후에 거래를 시작하세요!
            <img
              src="/notice/trade/11.png"
              alt="거래 안내 11"
              className="w-full max-w-[500px] h-auto object-contain rounded bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mx-auto mt-2"
            />
          </li>
        </ol>
      </section>
    </div>
  );
}
