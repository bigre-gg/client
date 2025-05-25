import ItemIcon from "@/app/ui/ItemIcon";
import { useState, useRef, useEffect } from "react";

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
export const OPTION_TRANSLATIONS: Record<string, string> = {
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
export interface ItemApiResponse {
  _id?: string;
  itemId: number;
  name: string;
  price?: number;
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

interface EditableItemDetailBodyProps {
  item: Partial<ItemApiResponse>;
  upgradeCount: number;
  setUpgradeCount: (count: number) => void;
  tuc: number;
  setTuc: (count: number) => void;
  options: { [key: string]: number | undefined };
  setOptions: (
    options:
      | { [key: string]: number | undefined }
      | ((prev: { [key: string]: number | undefined }) => {
          [key: string]: number | undefined;
        })
  ) => void;
  potentialOptions: { [key: string]: number };
  setPotentialOptions: (options: { [key: string]: number }) => void;
  customPotentialOptions: { [key: string]: string };
  setCustomPotentialOptions: (
    options:
      | { [key: string]: string }
      | ((prev: { [key: string]: string }) => { [key: string]: string })
  ) => void;
  cardSize?: number;
  readOnly?: boolean;
}

// input 공통 스타일
const underlineInputClass =
  "bg-transparent border-0 border-b-2 border-yellow-300 focus:border-blue-400 text-yellow-300 text-sm text-center font-bold appearance-none outline-none p-0 m-0 leading-none";
const underlineInputWhiteClass =
  "bg-transparent border-0 border-b-2 border-white focus:border-blue-400 text-white text-sm text-center font-bold appearance-none outline-none p-0 m-0 leading-none";
const underlineInputOptionClass =
  "bg-transparent border-0 border-b-2 border-white focus:border-blue-400 text-white text-sm text-center font-bold appearance-none outline-none p-0 m-0 leading-none";

export default function EditableItemDetailBody({
  item,
  upgradeCount,
  setUpgradeCount,
  tuc,
  setTuc,
  options,
  setOptions,
  potentialOptions,
  setPotentialOptions,
  customPotentialOptions,
  setCustomPotentialOptions,
  cardSize = 290,
  readOnly = false,
}: EditableItemDetailBodyProps) {
  // 직업 코드를 직업 이름으로 변환
  const requiredJob =
    item.reqJob !== undefined ? JOB_MAP[item.reqJob] || "전체" : "전체";

  // 직업에 따른 색상 결정 함수
  const getJobColor = (job: string) => {
    // 모든 직업 착용 가능
    if (item.reqJob === 0 || item.reqJob === undefined) {
      return "#fff";
    }

    // 비트마스크 기반으로 직업 요구사항 확인
    const jobCode = JOB_CODES[job as keyof typeof JOB_CODES];
    if (!jobCode) return "#ff0000"; // 직업 코드가 없으면 빨간색(착용 불가)

    // 비트 연산으로 해당 직업 착용 가능 여부 확인
    return item.reqJob !== undefined && (item.reqJob & jobCode) !== 0
      ? "#fff"
      : "#ff0000";
  };

  // 업그레이드 횟수, 업그레이드 가능 횟수, 옵션, 잠재옵션 모두 string으로 관리
  const [upgradeCountStr, setUpgradeCountStr] = useState("0");
  const [tucStr, setTucStr] = useState(
    item.tuc !== undefined ? item.tuc.toString() : ""
  );
  const [optionsStr, setOptionsStr] = useState<{ [key: string]: string }>(
    Object.fromEntries(
      Object.entries(item.options || {}).map(([k, v]) => [
        k,
        v?.toString() ?? "",
      ])
    )
  );
  // 잠재옵션 입력값은 string으로만 관리 (내부 상태)
  const [potentialOptionsInput, setPotentialOptionsInput] = useState<{
    [key: string]: string;
  }>({});

  // 옵션 변경 핸들러
  const handleOptionChange = (key: string, value: string) => {
    setOptionsStr((prev) => {
      const next = { ...prev, [key]: value };
      setOptions(
        Object.fromEntries(
          Object.entries(next)
            .filter(([_, v]) => v !== "" && !isNaN(Number(v)))
            .map(([k, v]) => [k, Number(v)])
        )
      );
      return next;
    });
  };

  // 업그레이드 횟수 변경 핸들러
  const handleUpgradeCountChange = (value: string) => {
    setUpgradeCountStr(value);
    setUpgradeCount(Number(value) || 0);
  };

  // tuc 변경 핸들러
  const handleTucChange = (value: string) => {
    setTucStr(value);
    setTuc(Number(value) || 0);
  };

  // 잠재옵션 변경 핸들러
  const handlePotentialChange = (key: string, value: string) => {
    setPotentialOptionsInput((prev) => ({ ...prev, [key]: value }));
  };

  // 상위 setter 분리 (props 타입이 다를 수 있으니 별도 변수)
  const setPotentialOptionsProp =
    typeof setPotentialOptions === "function" ? setPotentialOptions : () => {};

  // 옵션 수정 핸들러
  const handleOptionChangeNum = (key: string, value: number) => {
    setOptions({ ...options, [key]: value });
  };

  // key에 대한 한글 이름 찾기
  const getOptionName = (key: string) => {
    return OPTION_TRANSLATIONS[key] || key;
  };

  // 옵션 추가 관련 상태
  const [showOptionList, setShowOptionList] = useState(false);
  const [showPotentialList, setShowPotentialList] = useState(false);
  const optionListRef = useRef<HTMLDivElement>(null);
  const potentialListRef = useRef<HTMLDivElement>(null);

  // 옵션 목록
  const availableOptions = Object.keys(OPTION_TRANSLATIONS).filter(
    (key) => !(key in optionsStr)
  );
  // 잠재옵션 목록 (예시)
  const potentialOptionMap: Record<string, string> = {
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
  const availablePotentialOptions = Object.keys(potentialOptionMap).filter(
    (key) => !(key in potentialOptionsInput)
  );

  // 바깥 클릭 시 옵션/잠재옵션 리스트 닫기
  useEffect(() => {
    if (!showOptionList && !showPotentialList) return;
    function handleClick(e: MouseEvent) {
      if (
        (showOptionList &&
          optionListRef.current &&
          !optionListRef.current.contains(e.target as Node)) ||
        (showPotentialList &&
          potentialListRef.current &&
          !potentialListRef.current.contains(e.target as Node))
      ) {
        setShowOptionList(false);
        setShowPotentialList(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showOptionList, showPotentialList]);

  // 옵션 추가 핸들러
  const handleAddOption = (key: string) => {
    setOptionsStr({ ...optionsStr, [key]: "" });
    setShowOptionList(false);
  };
  // 잠재옵션 추가 핸들러
  const handleAddPotentialOption = (key: string) => {
    setPotentialOptionsInput((prev) => ({ ...prev, [key]: "" }));
    setShowPotentialList(false);
  };
  // 잠재옵션 삭제
  const handleRemovePotentialOption = (key: string) => {
    setPotentialOptionsInput((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // 옵션 삭제 핸들러
  const handleRemoveOption = (key: string) => {
    const next = { ...optionsStr };
    delete next[key];
    setOptionsStr(next);
  };

  // 최초 로드된 기본 옵션 키
  const initialOptionKeys = Object.keys(item.options || {});

  // 커스텀 잠재옵션 입력 상태만 내부에서 관리
  const [customPotentialInput, setCustomPotentialInput] = useState("");

  // 커스텀 잠재옵션 추가 핸들러
  const handleAddCustomPotential = () => {
    const key = customPotentialInput.trim();
    if (!key || customPotentialOptions[key] || potentialOptionsInput[key])
      return;
    setCustomPotentialOptions((prev) => ({ ...prev, [key]: "" }));
    setCustomPotentialInput("");
  };
  // 커스텀 잠재옵션 삭제
  const handleRemoveCustomPotential = (key: string) => {
    setCustomPotentialOptions((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  // 커스텀 잠재옵션 값 변경
  const handleCustomPotentialValueChange = (key: string, value: string) => {
    setCustomPotentialOptions((prev) => ({ ...prev, [key]: value }));
  };
  // 엔터로 추가
  const handleCustomPotentialInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleAddCustomPotential();
    }
  };

  // 가격 입력 상태 및 콤마 처리
  const [priceStr, setPriceStr] = useState(
    item.price ? item.price.toLocaleString() : ""
  );
  // 한글 금액 환산 함수
  function getKoreanMoneyUnit(price: number) {
    if (isNaN(price)) return "";
    if (price >= 100000000) {
      const 억 = Math.floor(price / 100000000);
      const 만 = Math.floor((price % 100000000) / 10000);
      return `${억}억${만 > 0 ? ` ${만}만` : ""}원`;
    } else if (price >= 10000) {
      return `${Math.floor(price / 10000)}만${
        price % 10000 > 0 ? ` ${price % 10000}원` : "원"
      }`;
    } else {
      return `${price}원`;
    }
  }
  const priceNumber = Number(priceStr.replace(/[^0-9]/g, ""));
  const priceKorean = priceStr ? getKoreanMoneyUnit(priceNumber) : "";

  // 잠재옵션 입력값이 바뀔 때마다 부모 상태 동기화
  useEffect(() => {
    setPotentialOptions(
      Object.fromEntries(
        Object.entries(potentialOptionsInput)
          .filter(([_, v]) => v !== "" && !isNaN(Number(v)))
          .map(([k, v]) => [k, Number(v)])
      )
    );
  }, [potentialOptionsInput, setPotentialOptions]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center w-full">
        <div
          className="flex flex-col p-3 w-full sm:w-[300px] relative"
          style={{
            background: "#1d668d",
            color: "white",
            maxWidth: 285,
            minHeight: 285,
            fontFamily: "Dotum, 돋움, 'Apple SD Gothic Neo', sans-serif",
            border: "2px solid #fff",
            boxShadow: "0 0 0 4px transparent, 0 0 0 6px #3a8ecb",
            borderRadius: 6,
            transform: "scale(0.95)",
            transformOrigin: "top left",
          }}
        >
          {/* 아이템 이름과 업그레이드 횟수 입력(괄호 안에 + 기호 포함) */}
          <div className="font-bold mb-3 text-center">
            <div className="flex items-center justify-center text-lg">
              <span>{item.name}</span>
              <span className="ml-2 flex items-center">
                (<span className="font-bold">+</span>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={upgradeCountStr}
                  onChange={(e) => handleUpgradeCountChange(e.target.value)}
                  className={underlineInputClass}
                  style={{
                    width: `${Math.max(1, upgradeCountStr.length) + 1}ch`,
                    minWidth: 16,
                    textAlign: "center",
                  }}
                  aria-label="업그레이드 횟수"
                />
                )
              </span>
            </div>
          </div>

          <div className="flex flex-row">
            {/* 아이템 아이콘 */}
            <div className="mr-3">
              <div className="w-[72px] h-[72px] flex items-center justify-center">
                {item.itemId ? (
                  <ItemIcon id={item.itemId} size={72} disableDarkBg={true} />
                ) : (
                  <div className="w-[72px] h-[72px] bg-gray-700 rounded flex items-center justify-center text-xs">
                    아이콘
                  </div>
                )}
              </div>
            </div>
            {/* 요구 능력치 */}
            <div
              className="flex flex-col gap-0 text-xs items-center justify-center text-center"
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
            className="flex flex-wrap gap-2 mt-2 mb-1 justify-center"
            style={{
              fontSize: 12.5,
              fontWeight: "normal",
            }}
          >
            {JOBS.map((job, index) => (
              <span
                key={job}
                style={{
                  color: getJobColor(job),
                }}
              >
                {job}
                {index < JOBS.length - 1 ? " " : ""}
              </span>
            ))}
          </div>
          {/* 구분선 */}
          <div
            style={{
              borderTop: "2px solid #fff",
              opacity: 0.7,
              margin: "6px 0",
            }}
          />
          {/* 상세 옵션 */}
          <div
            className="text-xs space-y-0.5 text-center"
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

            {/* 수정 가능한 옵션들 */}
            {Object.entries(optionsStr).map(([key, value]) => {
              const label = getOptionName(key);
              return (
                <div
                  key={key}
                  className="flex justify-center items-center space-x-1 mb-1"
                >
                  <span style={{ color: "#fff" }}>{label} : +</span>
                  <input
                    type="number"
                    value={value}
                    onChange={
                      readOnly
                        ? undefined
                        : (e) => handleOptionChange(key, e.target.value)
                    }
                    className={underlineInputOptionClass}
                    style={{
                      width: `${Math.max(1, value.length) + 1}ch`,
                      minWidth: 16,
                      textAlign: "center",
                    }}
                    readOnly={readOnly}
                  />
                  {/* 추가된 옵션만 x 버튼 노출 (readOnly 아닐 때만) */}
                  {!readOnly && !initialOptionKeys.includes(key) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(key)}
                      className="ml-1 text-xs text-red-300 hover:text-red-500"
                      aria-label="옵션 삭제"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}

            {/* 업그레이드 관련 필드들 */}
            <div className="flex justify-center items-center space-x-1 mt-2">
              <span style={{ color: "#fff" }}>업그레이드 가능 횟수 : </span>
              <input
                type="number"
                min={0}
                value={tucStr}
                onChange={(e) => handleTucChange(e.target.value)}
                className={underlineInputWhiteClass}
                style={{
                  width: `${Math.max(1, tucStr.length) + 1}ch`,
                  minWidth: 16,
                  textAlign: "center",
                }}
              />
            </div>

            {/* 구분선 */}
            <div className="my-2 border-t-2 border-white opacity-60" />

            {/* 잠재옵션 및 커스텀 잠재옵션 모두 디테일 카드 내에 표시 */}
            {Object.entries(potentialOptionsInput).length > 0 && (
              <>
                {Object.entries(potentialOptionsInput).map(([key, value]) => {
                  const label = potentialOptionMap[key];
                  const isPercent = key.endsWith("P");
                  return (
                    <div
                      key={key}
                      className="flex justify-center items-center space-x-1 mb-1 mt-1"
                    >
                      <span style={{ color: "#fff" }}>{label} : +</span>
                      <input
                        type="number"
                        value={value}
                        onChange={
                          readOnly
                            ? undefined
                            : (e) => handlePotentialChange(key, e.target.value)
                        }
                        className={underlineInputOptionClass}
                        style={{
                          width: `${Math.max(1, value.length) + 1}ch`,
                          minWidth: 16,
                          textAlign: "center",
                        }}
                        readOnly={readOnly}
                      />
                      {isPercent && <span style={{ color: "#fff" }}>%</span>}
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemovePotentialOption(key)}
                          className="ml-1 text-xs text-red-300 hover:text-red-500"
                          aria-label="잠재옵션 삭제"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            {/* 커스텀 잠재옵션도 디테일 카드 내에 표시 */}
            {Object.entries(customPotentialOptions).length > 0 && (
              <>
                {Object.entries(customPotentialOptions).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-center items-center space-x-1 mb-1 mt-1"
                  >
                    <span style={{ color: "#fff" }}>{key} : +</span>
                    <input
                      type="text"
                      value={value}
                      onChange={
                        readOnly
                          ? undefined
                          : (e) =>
                              handleCustomPotentialValueChange(
                                key,
                                e.target.value
                              )
                      }
                      className={underlineInputOptionClass}
                      style={{
                        width: `${Math.max(1, value.length) + 1}ch`,
                        minWidth: 16,
                        textAlign: "center",
                      }}
                      readOnly={readOnly}
                    />
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomPotential(key)}
                        className="ml-1 text-xs text-red-300 hover:text-red-500"
                        aria-label="커스텀 잠재옵션 삭제"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      {/* 옵션/잠재옵션 + 버튼을 카드(옵션 입력란) 아래로 이동 */}
      <div className="flex flex-col items-center gap-2 mt-4 w-full">
        <div className="flex gap-6 justify-center">
          <div className="flex items-center relative">
            <span className="mr-2 text-sm text-gray-800 dark:text-gray-200">
              아이템 옵션
            </span>
            <button
              type="button"
              onClick={() => setShowOptionList((v) => !v)}
              className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 shadow-sm hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="아이템 옵션 추가"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3.2V12.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3.2 8H12.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {showOptionList && (
              <div
                ref={optionListRef}
                className="absolute left-0 top-8 z-10 min-w-[110px] bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg py-1 animate-fadein max-h-60 overflow-y-auto"
                style={{ fontSize: "13px" }}
              >
                {availableOptions.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">
                    추가 가능한 옵션 없음
                  </div>
                ) : (
                  availableOptions.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="block w-full text-left px-3 py-1 hover:bg-blue-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-gray-100"
                      onClick={() => handleAddOption(key)}
                    >
                      {OPTION_TRANSLATIONS[key] || key}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex items-center relative">
            <span className="mr-2 text-sm text-gray-800 dark:text-gray-200">
              잠재 옵션
            </span>
            <button
              type="button"
              onClick={() => setShowPotentialList((v) => !v)}
              className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 shadow-sm hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="잠재옵션 추가"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3.2V12.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3.2 8H12.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {showPotentialList && (
              <div
                ref={potentialListRef}
                className="absolute left-0 top-8 z-10 min-w-[110px] bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg py-1 animate-fadein max-h-60 overflow-y-auto"
                style={{ fontSize: "13px" }}
              >
                {availablePotentialOptions.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">
                    추가 가능한 잠재옵션 없음
                  </div>
                ) : (
                  availablePotentialOptions.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="block w-full text-left px-3 py-1 hover:bg-blue-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-gray-100"
                      onClick={() => handleAddPotentialOption(key)}
                    >
                      {potentialOptionMap[key]}
                      {key.endsWith("P") ? " %" : ""}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {/* 커스텀 잠재옵션 추가 UI (옵션/잠재옵션 + 버튼 아래) */}
        <div className="w-full flex flex-col items-center mt-4">
          <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">
            잠재 옵션 커스텀 추가
          </div>
          <div className="flex gap-2 w-full justify-center">
            <input
              type="text"
              value={customPotentialInput}
              onChange={(e) => setCustomPotentialInput(e.target.value)}
              onKeyDown={handleCustomPotentialInputKeyDown}
              placeholder="옵션명을 입력하세요"
              className="border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-sm px-2 py-1 text-gray-900 dark:text-white focus:border-blue-400 outline-none min-w-[120px]"
            />
            <button
              type="button"
              onClick={handleAddCustomPotential}
              className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 shadow-sm hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="커스텀 잠재옵션 추가"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3.2V12.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3.2 8H12.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
