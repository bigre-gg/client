import ItemIcon from "@/app/ui/ItemIcon";
import { OPTION_TRANSLATIONS as BASE_OPTION_TRANSLATIONS } from "@/app/ui/EditableItemDetailBody";

const JOB_MAP: Record<number, string> = {
  0: "전체",
  1: "전사",
  2: "마법사",
  4: "궁수",
  8: "도적",
  16: "해적",
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
const JOB_CODES = {
  전사: 1,
  마법사: 2,
  궁수: 4,
  도적: 8,
  해적: 16,
};
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

// EditableItemDetailBody에서 사용하는 잠재옵션 매핑 복사
const POTENTIAL_OPTION_TRANSLATIONS: Record<string, string> = {
  str: "STR",
  dex: "DEX",
  int: "INT",
  luk: "LUK",
  strP: "STR",
  dexP: "DEX",
  intP: "INT",
  lukP: "LUK",
  allStatP: "올스탯",
  pad: "공격력",
  padP: "공격력",
  mad: "마력",
  madP: "마력",
  hp: "HP",
  hpP: "HP",
  mp: "MP",
  mpP: "MP",
  pdd: "물리 방어력",
  mdd: "마법 방어력",
  acc: "명중치",
  eva: "회피치",
  bossDmgP: "보스 몬스터 공격 시 데미지 증가",
  critRateP: "크리티컬 확률 증가",
  dmgP: "총 데미지",
  iedP: "몬스터 방어율 무시",
  invincSec: "피격 후 무적 시간 증가",
  healEffP: "HP 회복 아이템/스킬 효율",
  allResistP: "모든 속성 내성",
  dropRateP: "아이템/메소 획득 확률",
  mpReduceP: "모든 스킬의 MP 소모",
};

export interface TradeEquipDetailBodyProps {
  item: any; // baseItem
  trade: any; // trade row
  cardSize?: number;
}

export default function TradeEquipDetailBody({
  item,
  trade,
  cardSize = 320,
}: TradeEquipDetailBodyProps) {
  // trade의 옵션/업횟/잠재옵션/커스텀옵션을 우선 적용
  const merged = {
    ...item,
    ...trade,
    options: trade.options || item.options || {},
    tuc: trade.tuc ?? item.tuc,
  };
  const requiredJob =
    merged.reqJob !== undefined ? JOB_MAP[merged.reqJob] || "전체" : "전체";
  const getJobColor = (job: string) => {
    if (merged.reqJob === 0 || merged.reqJob === undefined) return "#fff";
    const jobCode = JOB_CODES[job as keyof typeof JOB_CODES];
    if (!jobCode) return "#ff0000";
    return merged.reqJob !== undefined && (merged.reqJob & jobCode) !== 0
      ? "#fff"
      : "#ff0000";
  };
  // 옵션
  const displayOptions = Object.entries(merged.options || {}).map(
    ([key, value]) => {
      let name = OPTION_TRANSLATIONS[key] || key;
      const numValue = typeof value === "number" ? value : Number(value ?? 0);
      const formattedValue =
        !isNaN(numValue) && numValue > 0 ? `+${numValue}` : numValue;
      return { name, value: formattedValue, key };
    }
  );
  // 잠재옵션
  const potentialOptions = merged.potentialOptions || {};
  // 커스텀 잠재옵션
  const customOptions: { [key: string]: string } = merged.customOptions
    ? Object.fromEntries(
        (merged.customOptions as any[]).map((opt) => [opt.label, opt.value])
      )
    : {};
  return (
    <div
      className="flex flex-col p-2"
      style={{
        background: "#1d668d",
        color: "white",
        minHeight: 200,
        fontFamily: "Dotum, 돋움, 'Apple SD Gothic Neo', sans-serif",
        border: "2px solid #fff",
        boxShadow: "0 0 0 4px transparent, 0 0 0 6px #3a8ecb",
        borderRadius: 6,
        width: 260,
        minWidth: 260,
        maxWidth: 260,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* 아이템 이름 */}
      <div className="text-lg font-bold mb-1 text-center">
        {merged.name}
        {typeof trade.upgradeCount === "number" && trade.upgradeCount > 0 && (
          <span className="ml-2 text-base font-bold">
            (+ {trade.upgradeCount})
          </span>
        )}
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center w-full relative">
        {/* 아이템 아이콘 */}
        <div className="flex-shrink-0 col-start-1 row-start-1 z-10">
          <ItemIcon id={merged.itemId} size={60} disableDarkBg={true} />
        </div>
        {/* 요구 능력치 */}
        <div
          className="flex flex-col gap-0 text-xs items-center justify-center text-center col-start-1 col-end-3 row-start-1 w-full justify-self-center"
          style={{
            lineHeight: 1.15,
            fontSize: "12.5px",
            fontWeight: "normal",
            letterSpacing: "0px",
          }}
        >
          <div>REQ LEV : {merged.reqLevelEquip}</div>
          <div>REQ STR : {merged.reqSTR}</div>
          <div>REQ DEX : {merged.reqDEX}</div>
          <div>REQ INT : {merged.reqINT}</div>
          <div>REQ LUK : {merged.reqLUK}</div>
        </div>
      </div>
      {/* 직업군 */}
      <div
        className="flex gap-2 mt-1 mb-1 justify-center"
        style={{ fontSize: 12.5, fontWeight: "normal" }}
      >
        {JOBS.map((job, index) => (
          <span key={job} style={{ color: getJobColor(job) }}>
            {job}
            {index < JOBS.length - 1 ? " " : ""}
          </span>
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
          <span>{merged.subCategory}</span>
        </div>
        {displayOptions.map((opt, i) => {
          const isPercent =
            typeof opt.key === "string" && opt.key.endsWith("P");
          return (
            <div key={String(opt.name)}>
              <span style={{ color: "#fff" }}>{opt.name} : </span>
              <span>
                {opt.value}
                {isPercent ? "%" : ""}
              </span>
            </div>
          );
        })}
        <div>
          <span style={{ color: "#fff" }}>업그레이드 가능 횟수 : </span>
          <span>{merged.tuc}</span>
        </div>

        {/* 잠재옵션 */}
        {potentialOptions && Object.keys(potentialOptions).length > 0 && (
          <>
            <div className="my-2 border-t-2 border-white opacity-60" />
            {Object.entries(potentialOptions).map(([key, value]) => {
              // EditableItemDetailBody와 동일하게 한글 label 매핑
              const label =
                POTENTIAL_OPTION_TRANSLATIONS[key] ||
                BASE_OPTION_TRANSLATIONS[key] ||
                key;
              const isPercent = typeof key === "string" && key.endsWith("P");
              return (
                <div key={String(key)}>
                  <span style={{ color: "#fff" }}>{label} : </span>
                  <span>
                    +{String(value)}
                    {isPercent ? "%" : ""}
                  </span>
                </div>
              );
            })}
          </>
        )}
        {/* 커스텀 잠재옵션 */}
        {customOptions && Object.keys(customOptions).length > 0 && (
          <>
            <div className="my-2 border-t-2 border-white opacity-60" />
            {Object.entries(customOptions).map(([key, value]) => (
              <div key={String(key)}>
                <span style={{ color: "#fff" }}>{key} : </span>
                <span>{String(value)}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
