import ItemIcon from "@/app/ui/ItemIcon";

const JOBS = ["초보자", "전사", "마법사", "궁수", "도적", "해적"];

export default function ItemDetailBody({
  item,
  cardSize = 320,
}: {
  item: any;
  cardSize?: number;
}) {
  return (
    <div
      className="flex flex-col p-4"
      style={{
        background: "#1d668d",
        color: "white",
        width: cardSize,
        minHeight: cardSize,
        fontFamily: "돋움, Dotum, 맑은 고딕, Malgun Gothic, Arial, sans-serif",
        border: "2px solid #fff",
        boxShadow: "0 0 0 4px transparent, 0 0 0 6px #3a8ecb",
        borderRadius: 6,
      }}
    >
      {/* 아이템 이름 */}
      <div
        className="text-lg font-bold mb-2 text-center"
        style={{ letterSpacing: 1 }}
      >
        {item.name}
      </div>
      <div className="flex flex-row">
        {/* 아이템 아이콘 */}
        <div className="mr-4">
          <ItemIcon id={item.id} size={64} disableDarkBg={true} />
        </div>
        {/* 요구 능력치 */}
        <div
          className="flex flex-col gap-0.5 text-xs"
          style={{ lineHeight: 1.2 }}
        >
          <div>REQ LEV : {item.requiredLevel}</div>
          <div>REQ STR : {item.requiredStr}</div>
          <div>REQ DEX : {item.requiredDex}</div>
          <div>REQ INT : {item.requiredInt}</div>
          <div>REQ LUK : {item.requiredLuk}</div>
          <div>REQ POP : {item.requiredPop}</div>
        </div>
      </div>
      {/* 직업군 */}
      <div
        className="flex gap-2 mt-2 mb-2 justify-center"
        style={{ fontSize: 16 }}
      >
        {JOBS.map((job) => (
          <span
            key={job}
            style={{
              color: item.requiredJob === job ? "#fff" : "#ff0000",
              textShadow:
                item.requiredJob === job ? "0 0 2px #fff" : "0 0 1px #ff0000",
            }}
          >
            {job}
          </span>
        ))}
      </div>
      {/* 구분선 */}
      <div
        style={{ borderTop: "2px solid #fff", opacity: 0.7, margin: "8px 0" }}
      />
      {/* 상세 옵션 */}
      <div className="text-xs space-y-0.5 text-center">
        <div>
          <span style={{ color: "#fff" }}>장비분류 : </span>
          <span>{item.category}</span>
        </div>
        {item.options &&
          item.options.map((opt: any) => (
            <div key={opt.name}>
              <span style={{ color: "#fff" }}>{opt.name} : </span>
              <span>{opt.value}</span>
            </div>
          ))}
        <div>
          <span style={{ color: "#fff" }}>업그레이드 가능 횟수 : </span>
          <span>{item.upgradeCount}</span>
        </div>
      </div>
    </div>
  );
}
