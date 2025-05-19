import ItemIcon from "@/app/ui/ItemIcon";

// 직업 코드에 따른 직업군 매핑 (0: 모든 직업, 1~6: 초보자~해적, 8: 도적, 16: 해적)
const JOB_MAP: Record<number, string> = {
  0: "전체",
  1: "전사",
  2: "마법사",
  4: "궁수",
  8: "도적",
  16: "해적",
  // 복합적인 직업군 요구사항 처리 (비트마스크)
  3: "전사/마법사",
  5: "전사/궁수",
  9: "전사/도적",
  17: "전사/해적",
  6: "마법사/궁수",
  10: "마법사/도적",
  18: "마법사/해적",
  12: "궁수/도적",
  20: "궁수/해적",
  24: "도적/해적",
};

// 직업 코드 매핑 (비트마스크 값)
const JOB_CODES = {
  전사: 1,
  마법사: 2,
  궁수: 4,
  도적: 8,
  해적: 16,
};

// 옵션 키를 한글로 변환하는 매핑
const OPTION_TRANSLATIONS: Record<string, string> = {
  incSTR: "STR",
  incDEX: "DEX",
  incINT: "INT",
  incLUK: "LUK",
  incPAD: "공격력",
  incMAD: "마력",
  incPDD: "물리 방어력",
  incMDD: "마법 방어력",
  incACC: "명중률",
  incEVA: "회피율",
  incSpeed: "이동 속도",
  incJump: "점프력",
  incMHP: "최대 HP",
  incMMP: "최대 MP",
};

const JOBS = ["초보자", "전사", "마법사", "궁수", "도적", "해적"];

// API 응답 인터페이스
interface ItemApiResponse {
  _id: string;
  itemId: number;
  name: string;
  price: number;
  tuc: number; // 업그레이드 가능 횟수
  options: {
    [key: string]: number | undefined;
  };
  subCategory: string; // 장비분류
  reqLevelEquip: number; // 요구 레벨
  reqSTR: number;
  reqDEX: number;
  reqINT: number;
  reqLUK: number;
  reqJob: number; // 직업 코드
}

export default function ItemDetailBody({
  item,
  cardSize = 290,
}: {
  item: ItemApiResponse;
  cardSize?: number;
}) {
  // 직업 코드를 직업 이름으로 변환
  const requiredJob = JOB_MAP[item.reqJob] || "전체";

  // 직업에 따른 색상 결정 함수
  const getJobColor = (job: string) => {
    // 모든 직업 착용 가능
    if (item.reqJob === 0) {
      return "#fff";
    }

    // 비트마스크 기반으로 직업 요구사항 확인
    const jobCode = JOB_CODES[job as keyof typeof JOB_CODES];
    if (!jobCode) return "#ff0000"; // 직업 코드가 없으면 빨간색(착용 불가)

    // 비트 연산으로 해당 직업 착용 가능 여부 확인
    return (item.reqJob & jobCode) !== 0 ? "#fff" : "#ff0000";
  };

  // 옵션을 표시할 수 있는 형태로 변환
  const displayOptions = Object.entries(item.options || {}).map(
    ([key, value]) => {
      // 옵션 키 이름을 한글로 변환
      let name = OPTION_TRANSLATIONS[key] || key;

      // 값 포맷팅 (양수는 +, 음수는 그대로)
      const formattedValue =
        value !== undefined && value > 0 ? `+${value}` : value;

      return { name, value: formattedValue };
    }
  );

  return (
    <div
      className="flex flex-col p-3"
      style={{
        background: "#1d668d",
        color: "white",
        width: cardSize,
        maxWidth: cardSize,
        minHeight: cardSize * 0.95,
        fontFamily: "Dotum, 돋움, 'Apple SD Gothic Neo', sans-serif",
        border: "2px solid #fff",
        boxShadow: "0 0 0 4px transparent, 0 0 0 6px #3a8ecb",
        borderRadius: 6,
        transform: "scale(0.95)",
        transformOrigin: "top left",
      }}
    >
      {/* 아이템 이름 */}
      <div className="text-lg font-bold mb-1 text-center">{item.name}</div>
      <div className="flex flex-row">
        {/* 아이템 아이콘 */}
        <div className="mr-3">
          <ItemIcon id={item.itemId} size={60} disableDarkBg={true} />
        </div>
        {/* 요구 능력치 */}
        <div
          className="flex flex-col gap-0 text-xs"
          style={{
            lineHeight: 1.15,
            fontSize: "12.5px",
            fontWeight: "normal",
            letterSpacing: "0px",
          }}
        >
          <div>REQ LEV : {item.reqLevelEquip}</div>
          <div>REQ STR : {item.reqSTR}</div>
          <div>REQ DEX : {item.reqDEX}</div>
          <div>REQ INT : {item.reqINT}</div>
          <div>REQ LUK : {item.reqLUK}</div>
        </div>
      </div>
      {/* 직업군 */}
      <div
        className="flex gap-2 mt-1 mb-1 justify-center"
        style={{
          fontSize: 12.5,
          fontWeight: "normal",
        }}
      >
        {JOBS.map((job, index) => (
          <>
            <span
              key={job}
              style={{
                color: getJobColor(job),
              }}
            >
              {job}
            </span>
            {index < JOBS.length - 1 && (
              <span style={{ width: "0.1px" }}></span>
            )}
          </>
        ))}
      </div>
      {/* 구분선 */}
      <div
        style={{ borderTop: "2px solid #fff", opacity: 0.7, margin: "6px 0" }}
      />
      {/* 상세 옵션 */}
      <div
        className="text-xs space-y-0 text-center"
        style={{
          fontSize: "12.5px",
          fontWeight: "normal",
          letterSpacing: "0px",
        }}
      >
        <div>
          <span style={{ color: "#fff" }}>장비분류 : </span>
          <span>{item.subCategory}</span>
        </div>
        {displayOptions.map((opt) => (
          <div key={opt.name}>
            <span style={{ color: "#fff" }}>{opt.name} : </span>
            <span>{opt.value}</span>
          </div>
        ))}
        <div>
          <span style={{ color: "#fff" }}>업그레이드 가능 횟수 : </span>
          <span>{item.tuc}</span>
        </div>
      </div>
    </div>
  );
}
