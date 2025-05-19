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
  // 필터 옵션 목록
  const getIncOptions = () => {
    if (!item.options) return Object.keys(optionMap);
    return Object.keys(item.options).filter((key) => key.startsWith("inc"));
  };

  // 필터 state: string만 사용
  const [filters, setFilters] = useState(() => {
    const base: any = {
      priceMin: "0",
      priceMax: "9999999999",
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

  // 현재 필터에 추가된 옵션 key들 (Min/Max로 관리되므로 key에서 Min/Max 제거, 기본 필터는 제외)
  const baseKeys = ["price", "scroll", "tuc"];
  const addedOptionKeys = Object.keys(filters)
    .filter((k) => k.endsWith("Min"))
    .map((k) => k.replace(/Min$/, ""))
    .filter((k) => !baseKeys.includes(k));

  // optionMap 기준, 현재 필터에 없는 옵션만 리스트로
  const availableOptions = Object.keys(optionMap).filter(
    (key) => !addedOptionKeys.includes(key)
  );

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

  // 옵션 추가 함수
  function handleAddOption(key: string) {
    setFilters((prev: Record<string, string>) => ({
      ...prev,
      [key + "Min"]: (item.options?.[key] ?? 0).toString(),
      [key + "Max"]: (item.options?.[key] ?? 0).toString(),
    }));
    setShowOptionList(false);
  }

  // 옵션 제거 함수 (Min/Max 모두 삭제)
  function handleRemoveOption(key: string) {
    setFilters((prev: Record<string, string>) => {
      const newFilters = { ...prev };
      delete newFilters[key + "Min"];
      delete newFilters[key + "Max"];
      return newFilters;
    });
  }

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
    return (
      <div className="mb-1 flex items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs mb-1 text-gray-700 dark:text-gray-200">
            <span className="w-14 min-w-[48px] text-left text-sm">{label}</span>
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
            <span className="text-gray-400">~</span>
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
            {rightElement}
          </div>
          <hr className="my-2 border-gray-400 dark:border-zinc-700" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-0 w-full max-w-[320px] bg-gray-100 dark:bg-zinc-800 min-h-full"
      style={{
        fontFamily:
          "Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, 돋움, Dotum, Arial, sans-serif",
      }}
    >
      <div className="p-3 w-full">
        <h2 className="text-sm mb-2 text-gray-900 dark:text-white text-left">
          아이템 옵션 필터
        </h2>
        <hr className="border-t-2 border-gray-400 dark:border-zinc-700 mb-3" />
        {renderFilterBlock("가격", "priceMin", "priceMax")}
        {/* 옵션 필터 (추가된 옵션만, 우측에 x 버튼) */}
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
        {renderFilterBlock("작 횟수", "scrollMin", "scrollMax")}
        {renderFilterBlock(
          <span className="whitespace-pre-line">{"가능\n업횟수"}</span>,
          "tucMin",
          "tucMax"
        )}
        {/* +버튼을 '가능 업횟수' 필터 아래에 별도 배치 */}
        <div className="flex justify-start mb-2">
          <div className="relative">
            <PlusButton
              onClick={() => setShowOptionList((v) => !v)}
              active={showOptionList}
            />
            {showOptionList && (
              <div
                ref={optionListRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 min-w-[110px] bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg py-1 animate-fadein"
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
      </div>
    </div>
  );
}
