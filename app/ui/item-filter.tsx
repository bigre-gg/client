import { useState, useEffect, useRef } from "react";
import { ItemApiResponse } from "@/lib/items";

const optionMap: { [key: string]: string } = {
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

// 잠재 옵션 리스트 (영어 변수명: 한글)
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

function SimpleNumberInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel?: string;
}) {
  // 증가/감소 핸들러
  const handleSpin = (up: boolean) => {
    const num = Number(value) || 0;
    const next = up ? num + 1 : num - 1;
    onChange(next >= 0 ? next.toString() : "0");
  };
  return (
    <div className="relative flex items-center w-20">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (/^\d*$/.test(v)) onChange(v);
        }}
        className="w-full pr-5 pl-1 py-0.5 border text-xs bg-gray-100 dark:bg-[#3b3b3b] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none"
        style={{ height: "22px", fontSize: "12px" }}
        aria-label={ariaLabel}
      />
      <div className="absolute right-0 top-0 flex flex-col h-full justify-center">
        <button
          type="button"
          onClick={() => handleSpin(true)}
          className="w-4 h-3 flex items-center justify-center text-[10px] border-b border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tr-sm"
          tabIndex={-1}
          style={{ lineHeight: 1 }}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => handleSpin(false)}
          className="w-4 h-3 flex items-center justify-center text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-br-sm"
          tabIndex={-1}
          style={{ lineHeight: 1 }}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

function PlusButton({
  onClick,
  active,
}: {
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 shadow-sm hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        active ? "ring-2 ring-blue-400" : ""
      }`}
      style={{ marginRight: 6 }}
      aria-label="필터 옵션 추가"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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
  );
}

export default function ItemFilter({
  item,
  onFilterChange,
}: {
  item: ItemApiResponse;
  onFilterChange: (filters: any) => void;
}) {
  // 장비 여부 분기
  const isEquip = item && (item as any).isEquip !== false;

  // 비장비 아이템일 때는 가격 필터만 렌더링 (options 등 접근 X)
  if (!isEquip) {
    const [filters, setFilters] = useState<{
      priceMin: string;
      priceMax: string;
    }>({
      priceMin: "0",
      priceMax: "1000000000",
    });
    useEffect(() => {
      onFilterChange(filters);
    }, [filters, onFilterChange]);
    function renderFilterBlock(
      label: React.ReactNode,
      minKey: "priceMin" | "priceMax",
      maxKey: "priceMin" | "priceMax"
    ) {
      const isPrice = minKey === "priceMin" && maxKey === "priceMax";
      return (
        <div className="mb-1 flex flex-col sm:flex-row items-center w-full">
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 text-xs mb-1 text-gray-700 dark:text-gray-200 w-full">
              <span className="w-full sm:w-20 min-w-0 text-left text-sm flex-shrink-0">
                {label}
              </span>
              <div className="flex flex-row gap-1 w-full">
                <div className="flex flex-col items-start w-full min-w-0">
                  <SimpleNumberInput
                    value={filters[minKey]}
                    onChange={(v) =>
                      setFilters((f) => ({
                        ...f,
                        [minKey]: v,
                      }))
                    }
                    ariaLabel={
                      typeof label === "string" ? label + " 최소" : undefined
                    }
                  />
                  {isPrice && (
                    <div className="text-xs text-transparent mt-0.5 select-none">
                      0
                    </div>
                  )}
                </div>
                <span className="text-gray-400 flex-shrink-0">~</span>
                <div className="flex flex-col items-start w-full min-w-0">
                  <SimpleNumberInput
                    value={filters[maxKey]}
                    onChange={(v) =>
                      setFilters((f) => ({
                        ...f,
                        [maxKey]: v,
                      }))
                    }
                    ariaLabel={
                      typeof label === "string" ? label + " 최대" : undefined
                    }
                  />
                  {isPrice && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {Number(filters[maxKey]).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr className="my-2 border-gray-400 dark:border-zinc-700" />
          </div>
        </div>
      );
    }
    return (
      <div
        className="w-full max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md border border-gray-300 dark:border-zinc-700 rounded min-h-full"
        style={{
          fontFamily:
            "Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, 돋움, Dotum, Arial, sans-serif",
        }}
      >
        <div className="p-2 md:p-3 w-full">
          <h2 className="text-sm mb-2 text-gray-900 dark:text-white text-left">
            아이템 옵션 필터
          </h2>
          <hr className="border-t-2 border-gray-400 dark:border-zinc-700 mb-3" />
          {renderFilterBlock("가격", "priceMin", "priceMax")}
        </div>
      </div>
    );
  }

  // 필터 옵션 목록
  const getIncOptions = () => {
    if (!item.options) return Object.keys(optionMap);
    return Object.keys(item.options).filter((key) => key.startsWith("inc"));
  };

  // 필터 state: string만 사용
  const [filters, setFilters] = useState(() => {
    // 장비 아이템이면 기존 필터 모두
    const base: any = {
      priceMin: "0",
      priceMax: "1000000000",
      scrollMin: "0",
      scrollMax: (item.tuc || 0).toString(),
      tucMin: "0",
      tucMax: (item.tuc || 0).toString(),
    };
    getIncOptions().forEach((key) => {
      const value = item.options?.[key] ?? 0;
      base[key + "Min"] = value.toString();
      base[key + "Max"] = value.toString();
    });
    return base;
  });

  // 1. 아이템이 실제로 가진 옵션(incSTR 등)은 항상 필터로 표시, x(삭제) 불가
  const itemOptionKeys = item.options
    ? Object.keys(item.options).filter((k) => optionMap[k])
    : [];
  // 2. 추가로 사용자가 추가한 옵션(STR, DEX 등) 관리
  const [addedOptionKeys, setAddedOptionKeys] = useState<string[]>([]);
  // 3. + 버튼에서 optionMap 전체에서 이미 추가된 것(기본+추가 모두)은 제외
  const availableOptions = Object.keys(optionMap).filter(
    (key) => !itemOptionKeys.includes(key) && !addedOptionKeys.includes(key)
  );
  // 4. 옵션 추가/제거 함수
  function handleAddOption(key: string) {
    setAddedOptionKeys((prev) => [...prev, key]);
    setShowOptionList(false);
  }
  function handleRemoveOption(key: string) {
    setAddedOptionKeys((prev) => prev.filter((k) => k !== key));
  }

  // 옵션 추가 UI 상태
  const [showOptionList, setShowOptionList] = useState(false);
  const optionListRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 옵션 리스트 닫기
  useEffect(() => {
    if (!showOptionList) return;
    function handleClick(e: MouseEvent) {
      if (
        optionListRef.current &&
        !optionListRef.current.contains(e.target as Node)
      ) {
        setShowOptionList(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showOptionList]);

  // 필터 변경 시 부모에 알림
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // 필터 블록 (구분선 포함)
  function renderFilterBlock(
    label: React.ReactNode,
    minKey: string,
    maxKey: string,
    rightElement?: React.ReactNode
  ) {
    const isPrice = minKey === "priceMin" && maxKey === "priceMax";
    return (
      <div className="mb-1 flex flex-col sm:flex-row items-center w-full">
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 text-xs mb-1 text-gray-700 dark:text-gray-200 w-full">
            <span className="w-full sm:w-20 min-w-0 text-left text-sm flex-shrink-0">
              {label}
            </span>
            <div className="flex flex-row gap-1 w-full">
              <div className="flex flex-col items-start w-full min-w-0">
                <SimpleNumberInput
                  value={filters[minKey]}
                  onChange={(v) =>
                    setFilters((f: Record<string, string>) => ({
                      ...f,
                      [minKey]: v,
                    }))
                  }
                  ariaLabel={
                    typeof label === "string" ? label + " 최소" : undefined
                  }
                />
                {isPrice && (
                  <div className="text-xs text-transparent mt-0.5 select-none">
                    0
                  </div>
                )}
              </div>
              <span className="text-gray-400 flex-shrink-0">~</span>
              <div className="flex flex-col items-start w-full min-w-0">
                <SimpleNumberInput
                  value={filters[maxKey]}
                  onChange={(v) =>
                    setFilters((f: Record<string, string>) => ({
                      ...f,
                      [maxKey]: v,
                    }))
                  }
                  ariaLabel={
                    typeof label === "string" ? label + " 최대" : undefined
                  }
                />
                {isPrice && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    {Number(filters[maxKey]).toLocaleString()}
                  </div>
                )}
              </div>
              {rightElement && (
                <div className="flex-shrink-0 ml-1">{rightElement}</div>
              )}
            </div>
          </div>
          <hr className="my-2 border-gray-400 dark:border-zinc-700" />
        </div>
      </div>
    );
  }

  // 잠재 옵션 필터 상태 관리
  const basePotentialKeys = Object.keys(potentialOptionMap);
  const [potentialFilters, setPotentialFilters] = useState<{
    [key: string]: { min: string; max: string };
  }>(() => {
    const base: any = {};
    return base;
  });
  const addedPotentialKeys = Object.keys(potentialFilters);
  const availablePotentialOptions = basePotentialKeys.filter(
    (key) => !addedPotentialKeys.includes(key)
  );
  const [showPotentialList, setShowPotentialList] = useState(false);
  const potentialListRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 잠재 옵션 리스트 닫기
  useEffect(() => {
    if (!showPotentialList) return;
    function handleClick(e: MouseEvent) {
      if (
        potentialListRef.current &&
        !potentialListRef.current.contains(e.target as Node)
      ) {
        setShowPotentialList(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPotentialList]);

  function handleAddPotentialOption(key: string) {
    setPotentialFilters((prev) => ({
      ...prev,
      [key]: { min: "0", max: "100" },
    }));
    setShowPotentialList(false);
  }
  function handleRemovePotentialOption(key: string) {
    setPotentialFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }

  return (
    <div
      className="w-full max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md border border-gray-300 dark:border-zinc-700 rounded min-h-full"
      style={{
        fontFamily:
          "Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, 돋움, Dotum, Arial, sans-serif",
      }}
    >
      <div className="p-2 md:p-3 w-full">
        <h2 className="text-sm mb-2 text-gray-900 dark:text-white text-left">
          아이템 옵션 필터
        </h2>
        <hr className="border-t-2 border-gray-400 dark:border-zinc-700 mb-3" />
        {renderFilterBlock("가격", "priceMin", "priceMax")}
        {!isEquip ? null : (
          <>
            {renderFilterBlock("작 횟수", "scrollMin", "scrollMax")}
            {renderFilterBlock(
              <span className="whitespace-pre-line">{"가능\n업횟수"}</span>,
              "tucMin",
              "tucMax"
            )}
            {/* 아이템 옵션/잠재 옵션 필터 추가 버튼 (가능 업횟수 아래 한 줄에) */}
            <div className="flex gap-4 items-center mb-2 mt-2">
              <div className="flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-300 mr-1">
                  아이템 옵션
                </span>
                <div className="relative">
                  <PlusButton
                    onClick={() => setShowOptionList((v) => !v)}
                    active={showOptionList}
                  />
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
                            {optionMap[key] || key}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-300 mr-1">
                  잠재 옵션
                </span>
                <div className="relative">
                  <PlusButton
                    onClick={() => setShowPotentialList((v) => !v)}
                    active={showPotentialList}
                  />
                  {showPotentialList && (
                    <div
                      ref={potentialListRef}
                      className="absolute left-0 top-8 z-10 min-w-[180px] bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg py-1 animate-fadein max-h-60 overflow-y-auto"
                      style={{ fontSize: "13px" }}
                    >
                      {availablePotentialOptions.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">
                          추가 가능한 옵션 없음
                        </div>
                      ) : (
                        availablePotentialOptions.map((key) => (
                          <button
                            key={key}
                            type="button"
                            className="block w-full text-left px-3 py-1 hover:bg-blue-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-gray-100"
                            onClick={() => handleAddPotentialOption(key)}
                          >
                            {potentialOptionMap[key] +
                              (key.endsWith("P") ? " %" : "")}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* 기본 아이템 옵션 필터(삭제 불가, 아래에만) */}
            {itemOptionKeys.map((key) => (
              <div key={key}>
                {renderFilterBlock(
                  optionMap[key] || key,
                  key + "Min",
                  key + "Max"
                )}
              </div>
            ))}
            {/* 추가된 아이템 옵션 필터(x로 삭제 가능) */}
            {addedOptionKeys.map((key) => (
              <div key={key}>
                {renderFilterBlock(
                  optionMap[key] || key,
                  key + "Min",
                  key + "Max",
                  <button
                    type="button"
                    className="ml-1 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    aria-label="옵션 삭제"
                    onClick={() => handleRemoveOption(key)}
                    tabIndex={0}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {/* 추가된 잠재 옵션 필터들 */}
            {addedPotentialKeys.map((key) => (
              <div key={key}>
                {renderFilterBlock(
                  potentialOptionMap[key] + (key.endsWith("P") ? " %" : ""),
                  key + "Min",
                  key + "Max",
                  <button
                    type="button"
                    className="ml-1 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    aria-label="옵션 삭제"
                    onClick={() => handleRemovePotentialOption(key)}
                    tabIndex={0}
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
  );
}
