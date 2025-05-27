"use client";
import Link from "next/link";

export default function NoticeRulePage() {
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
      <h1 className="text-2xl font-bold mb-2">빅리지지 이용 규칙</h1>
      <hr className="mb-10 border-gray-300 dark:border-zinc-700" />

      {/* 안내 설명 */}
      <div className="mb-8 text-base">
        원활한 빅리지지 이용을 위해 다음과 같은 이용 규칙을 만들었으니 꼭
        숙지하시고 사용해주시면 감사드리겠습니다.
      </div>
      <ul className="list-disc ml-6 mb-10 space-y-2 text-base">
        <li>
          무분별한 아이템 등록 행위를 방지하기 위해 등록할 수 있는 횟수에 제한을
          두고 있습니다.
        </li>
        <li>같은 아이템의 구매와 판매를 동시에 하지 못합니다.</li>
      </ul>

      <div className="mb-4 text-base font-semibold">
        다음과 같은 규칙 위반 행위를 할 경우 운영자 재량의 이용 제한 조치를 취할
        수 있습니다.
      </div>

      <ol className="list-decimal ml-6 space-y-10">
        <li>
          <div className="font-bold mb-2">시세 조작 행위</div>
          <div className="mb-2">
            시세 차익을 목적으로 팝니다, 삽니다 등록 시 운영자의 판단으로 경고
            없는 이용 제한 조치를 받을 수 있습니다. 의심 행동은 다음과 같습니다.
          </div>
          <ul className="list-disc ml-5 space-y-1">
            <li>평균 가격에 크게 벗어나는 가격의 아이템 등록</li>
            <li>무분별한 아이템 중복 등록</li>
            <li>아이템 거래 목적이 아닌 허위 등록</li>
          </ul>
          <hr className="my-6 border-gray-200 dark:border-zinc-700" />
        </li>
        <li>
          <div className="font-bold mb-2">정확한 정보 기재 의무</div>
          <div>
            빅뱅리턴즈 게임 내의 데이터에 접근할 수 없기 때문에, 최대한 정확한
            정보를 기재해야 합니다. 실수로 옵션을 잘못 기입해 타 유저의 신고가
            들어올 경우, 경고 없는 이용 제한 조치를 받을 수 있습니다.
          </div>
          <hr className="my-6 border-gray-200 dark:border-zinc-700" />
        </li>
        <li>
          <div className="font-bold mb-2">거래 책임</div>
          <div>
            빅리지지를 통한 빅뱅리턴즈 게임 내 거래에서 손해가 발생할 경우, 모든
            책임은 유저에게 있습니다. 위험한 거래 방식을 지양해주세요. (모르는
            유저와 수수료작 같은 행위 등)
          </div>
        </li>
      </ol>
    </div>
  );
}
