import ItemIcon from "@/app/ui/ItemIcon";

function formatDescription(desc: string) {
  if (!desc) return "설명 정보가 없습니다.";
  return desc
    .replace(/\\r\\n|\\n|\r\n|\n|\r/g, "\n") // 모든 줄바꿈 escape를 실제 줄바꿈으로
    .replace(/#c/g, "") // #c: 색상, 무시
    .replace(/#\w*|#/g, "") // #으로 시작하는 태그 및 # 단독 제거
    .replace(/  +/g, " ") // 연속 공백 정리
    .replace(/\n/g, "\n") // 혹시 남은 \n도 줄바꿈
    .trim();
}

export default function NonEquipItemDetail({
  itemId,
  name,
  description,
  cardSize = 290,
}: {
  itemId: number;
  name: string;
  description: string;
  cardSize?: number;
}) {
  return (
    <div
      className="w-[300px] bg-[#1d668d] text-white rounded-lg border-2 border-white shadow-lg"
      style={{
        minHeight: 180,
        fontFamily: "Dotum, 돋움, 'Apple SD Gothic Neo', sans-serif",
        boxShadow: "0 0 0 4px transparent, 0 0 0 6px #3a8ecb",
        padding: 0,
      }}
    >
      {/* 아이템 이름 */}
      <div
        className="text-lg font-bold text-center mt-0 mb-2"
        style={{ width: "100%" }}
      >
        {name}
      </div>
      <div className="flex flex-row items-start w-full px-4 pb-3 gap-2">
        <div style={{ minWidth: 60 }}>
          <ItemIcon id={itemId} size={60} disableDarkBg={true} />
        </div>
        <div
          className="text-xs whitespace-pre-line text-left"
          style={{
            fontSize: "13px",
            fontWeight: "normal",
            letterSpacing: "0px",
            wordBreak: "keep-all",
            whiteSpace: "pre-line",
          }}
        >
          {formatDescription(description)}
        </div>
      </div>
    </div>
  );
}
