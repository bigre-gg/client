"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ItemApiResponse, getItemById } from "@/lib/items";
import EditableItemDetailBody from "@/app/ui/EditableItemDetailBody";
import NonEquipItemDetail from "@/app/ui/NonEquipItemDetail";

const worldOptions = [
  "아무데나",
  "빅토리아",
  "오르비스",
  "엘나스",
  "루디브리엄",
  "리프레",
  "자유시장",
];

const hagglingOptions = [
  { value: "IMPOSSIBLE", label: "흥정 불가" },
  { value: "POSSIBLE", label: "흥정 가능" },
  { value: "NONE", label: "제안 받음" },
];

interface ItemData {
  id: number;
  name: string;
  isEquip: boolean;
}

export default function TradeRegisterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [item, setItem] = useState<Partial<ItemApiResponse>>({});
  const [type, setType] = useState("SELL");
  const [price, setPrice] = useState("");
  const [haggling, setHaggling] = useState("IMPOSSIBLE");
  const [quantity, setQuantity] = useState("1");
  const [prefferedWorld, setPrefferedWorld] = useState("아무데나");
  const [comment, setComment] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(true);

  // 추가 아이템 옵션
  const [upgradeCount, setUpgradeCount] = useState(0);
  const [tuc, setTuc] = useState(0);
  const [options, setOptions] = useState<{ [key: string]: number | undefined }>(
    {}
  );
  const [potentialOptions, setPotentialOptions] = useState<{
    [key: string]: number;
  }>({});
  const [addedOptions, setAddedOptions] = useState<string[]>([]);
  const [addedPotentialOptions, setAddedPotentialOptions] = useState<string[]>(
    []
  );

  // 커스텀 잠재옵션 상태
  const [customPotentialOptions, setCustomPotentialOptions] = useState<{
    [key: string]: string;
  }>({});

  // 디스코드 ID 상태
  const [discordId, setDiscordId] = useState<string | null>(null);
  const [userGlobalName, setUserGlobalName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");

  // 코인 입력 상태
  const [goldCoin, setGoldCoin] = useState("0");
  const [silverCoin, setSilverCoin] = useState("0");
  const [bronzeCoin, setBronzeCoin] = useState("0");

  // status API에서 discordId 받아오기 (경로 수정)
  useEffect(() => {
    async function fetchDiscordId() {
      try {
        const res = await fetch("/api/auth/status", { credentials: "include" });
        if (!res.ok) throw new Error("status api error");
        const data = await res.json();
        setDiscordId(data.user.discordId || null);
        setUserGlobalName(data.user.globalName || "");
        setUserAvatar(data.user.avatar || "");
      } catch (e) {
        setDiscordId(null);
        setUserGlobalName("");
        setUserAvatar("");
      }
    }
    fetchDiscordId();
  }, []);

  useEffect(() => {
    async function fetchItemDetail() {
      if (params.id) {
        setLoading(true);
        try {
          // getItemById 함수를 사용하여 아이템 정보 가져오기
          const itemData = await getItemById(params.id);
          console.log("가져온 아이템 데이터:", itemData);

          // 상태 설정
          setItem(itemData);
          setTuc(itemData.tuc || 0);
          setOptions(itemData.options || {});
        } catch (error) {
          console.error("아이템 상세 정보 가져오기 오류:", error);
          alert("아이템 정보를 가져오는데 실패했습니다.");
          router.push("/trade");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchItemDetail();
  }, [params.id, router]);

  // 옵션 추가 핸들러
  const handleAddOption = (key: string) => {
    if (!addedOptions.includes(key)) {
      setAddedOptions([...addedOptions, key]);
      setOptions({ ...options, [key]: 0 }); // 새 옵션을 디테일 내부로 바로 추가
    }
  };

  const handleRemoveOption = (key: string) => {
    setAddedOptions(addedOptions.filter((k) => k !== key));
    const newOptions = { ...options };
    delete newOptions[key];
    setOptions(newOptions);
  };

  const handleAddPotentialOption = (key: string) => {
    if (!addedPotentialOptions.includes(key)) {
      setAddedPotentialOptions([...addedPotentialOptions, key]);
      setPotentialOptions({ ...potentialOptions, [key]: 0 }); // 새 잠재옵션 추가
    }
  };

  const handleRemovePotentialOption = (key: string) => {
    setAddedPotentialOptions(addedPotentialOptions.filter((k) => k !== key));
    const newOptions = { ...potentialOptions };
    delete newOptions[key];
    setPotentialOptions(newOptions);
  };

  // 등록 핸들러
  const handleSubmit = async () => {
    if (!agree || !item.itemId) return;
    const gold = Number(goldCoin || 0);
    const silver = Number(silverCoin || 0);
    const bronze = Number(bronzeCoin || 0);
    const hasPrice = price && !isNaN(Number(price)) && Number(price) > 0;
    const hasCoin = gold > 0 || silver > 0 || bronze > 0;
    if (!hasPrice && !hasCoin) {
      alert("가격 또는 코인 중 하나 이상 입력해주세요.");
      return;
    }

    // 코인 문자열 생성
    let coin = "";
    if (gold > 0 || silver > 0 || bronze > 0) {
      coin = `${gold}g${silver}s${bronze}b`;
    }

    // 커스텀 잠재옵션을 customOptions 배열로 변환
    const customOptions = Object.entries(customPotentialOptions).map(
      ([label, value], idx) => ({
        key: `custom${idx + 1}`,
        label,
        value,
      })
    );

    const reqData =
      (item as any).type === "OTHERS"
        ? {
            itemId: item.itemId,
            userDiscordId: discordId,
            userGlobalName: userGlobalName,
            userAvatar: userAvatar,
            type,
            itemType: (item as any).type || "OTHERS",
            description: (item as any).description || "",
            itemPrice: Number(price),
            haggling,
            tradeWorld: prefferedWorld,
            comment,
            coin,
            quantity: Number(quantity) > 0 ? Number(quantity) : 1,
          }
        : {
            itemId: item.itemId,
            userDiscordId: discordId,
            userGlobalName: userGlobalName,
            userAvatar: userAvatar,
            type,
            itemType: (item as any).type || "OTHERS",
            upgradeCount,
            tuc,
            options,
            potentialOptions,
            customOptions,
            itemPrice: Number(price),
            haggling,
            tradeWorld: prefferedWorld,
            comment,
            coin,
            quantity: Number(quantity) > 0 ? Number(quantity) : 1,
          };

    console.log("Submitting item:", reqData);
    try {
      const response = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqData),
        credentials: "include",
      });
      if (!response.ok) throw new Error("등록 실패");

      alert("등록이 완료되었습니다.");
      router.push(`/item/${item.itemId}`);
    } catch (e) {
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-pulse bg-blue-500 h-12 w-12 rounded-full mb-4"></div>
        <p className="text-center">아이템 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      {/* 거래 주의사항 */}
      <div className="mb-4 p-3 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 text-sm">
        <ul className="list-disc pl-5">
          <li>거래 시 사기 피해에 주의하세요.</li>
          <li>사이트는 거래 중 발생하는 문제에 책임지지 않습니다.</li>
          <li>아이템 정보를 정확히 입력해 주세요.</li>
        </ul>
      </div>

      {/* 팝니다/삽니다 유형 선택 */}
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
            type === "SELL"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
          }`}
          onClick={() => setType("SELL")}
        >
          팝니다
        </button>
        <button
          className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
            type === "BUY"
              ? "bg-green-600 text-white"
              : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
          }`}
          onClick={() => setType("BUY")}
        >
          삽니다
        </button>
      </div>

      {/* 아이템 디테일 - EditableItemDetailBody로 교체 */}
      <div className="mb-4 flex justify-center">
        {item &&
          item.itemId &&
          ((item as any).type === "OTHERS" ? (
            <NonEquipItemDetail
              itemId={item.itemId}
              name={item.name || ""}
              description={(item as any).description || ""}
            />
          ) : (
            <EditableItemDetailBody
              item={item}
              upgradeCount={upgradeCount}
              setUpgradeCount={setUpgradeCount}
              tuc={tuc}
              setTuc={setTuc}
              options={options}
              setOptions={setOptions}
              potentialOptions={potentialOptions}
              setPotentialOptions={setPotentialOptions}
              customPotentialOptions={customPotentialOptions}
              setCustomPotentialOptions={setCustomPotentialOptions}
            />
          ))}
      </div>

      {/* 가격, 흥정, 월드, 코멘트 */}
      <div className="mb-4 p-4 rounded bg-lightBg dark:bg-darkBg border border-gray-300 dark:border-zinc-700 flex flex-col gap-3">
        <div>
          <label className="font-bold text-sm">수량</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, "");
              setQuantity(v);
            }}
            placeholder="1"
            className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 mt-1 mb-2"
          />
          <label className="font-bold text-sm">가격</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 mt-1"
          />
          <div className="text-xs text-gray-500 mt-1">
            {price ? Number(price).toLocaleString() : 0} 원
          </div>
          {/* or + 코인 입력 */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-gray-700 dark:text-gray-200">
              or
            </span>
            <img src="/goldCoin.png" alt="Gold Coin" className="w-6 h-6" />
            <input
              type="number"
              min={0}
              value={goldCoin}
              onChange={(e) =>
                setGoldCoin(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-12 border rounded px-1 py-0.5 bg-white dark:bg-zinc-800 text-center"
            />
            <img src="/silverCoin.png" alt="Silver Coin" className="w-6 h-6" />
            <input
              type="number"
              min={0}
              value={silverCoin}
              onChange={(e) =>
                setSilverCoin(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-12 border rounded px-1 py-0.5 bg-white dark:bg-zinc-800 text-center"
            />
            <img src="/bronzeCoin.png" alt="Bronze Coin" className="w-6 h-6" />
            <input
              type="number"
              min={0}
              value={bronzeCoin}
              onChange={(e) =>
                setBronzeCoin(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-12 border rounded px-1 py-0.5 bg-white dark:bg-zinc-800 text-center"
            />
          </div>
        </div>
        <div>
          <label className="font-bold text-sm">가격 흥정 여부</label>
          <div className="flex gap-2 mt-1">
            {hagglingOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="haggling"
                  value={opt.value}
                  checked={haggling === opt.value}
                  onChange={(e) => setHaggling(e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-bold text-sm">거래 선호 월드</label>
          <select
            value={prefferedWorld}
            onChange={(e) => setPrefferedWorld(e.target.value)}
            className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 mt-1"
          >
            {worldOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-bold text-sm">코멘트 (최대 60자)</label>
          <textarea
            maxLength={60}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 mt-1 h-16 resize-none"
            rows={2}
          />
        </div>
      </div>
      {/* 동의 및 등록 버튼 */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="agree"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <label htmlFor="agree" className="text-sm">
          위 내용에 동의합니다.
        </label>
      </div>
      <button
        className="w-full py-2 rounded bg-blue-600 text-white font-bold disabled:bg-gray-400"
        disabled={
          !agree ||
          !(
            (price && !isNaN(Number(price)) && Number(price) > 0) ||
            Number(goldCoin || 0) > 0 ||
            Number(silverCoin || 0) > 0 ||
            Number(bronzeCoin || 0) > 0
          ) ||
          !discordId
        }
        onClick={handleSubmit}
      >
        등록하기
      </button>
    </div>
  );
}
