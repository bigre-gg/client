"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ItemIcon from "./ItemIcon";

interface Item {
  id: number;
  name: string;
}

// 한글 초성 추출 함수
function getChosung(str: string) {
  const CHOSUNG_LIST = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 0xac00;
    if (code >= 0 && code < 11172) {
      result += CHOSUNG_LIST[Math.floor(code / 588)];
    } else {
      result += str[i];
    }
  }
  return result;
}

function isChosung(str: string) {
  // 한글 자음(초성)만으로 이루어진 문자열인지 체크
  return /^[ㄱ-ㅎ]+$/.test(str);
}

const RECENT_KEY = "recent_search_items";
const FAVORITE_KEY = "favorite_items";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [results, setResults] = useState<Item[]>([]);
  const [recent, setRecent] = useState<Item[]>([]);
  const [favorite, setFavorite] = useState<Item[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // localStorage에서 최근검색, 즐겨찾기 불러오기
  useEffect(() => {
    fetch("/items.json")
      .then((res) => res.json())
      .then((data) => setItems(data));
    const r = localStorage.getItem(RECENT_KEY);
    if (r) setRecent(JSON.parse(r));
    const f = localStorage.getItem(FAVORITE_KEY);
    if (f) setFavorite(JSON.parse(f));
  }, []);

  // 검색 결과 필터링
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    setResults(
      items.filter((item) => {
        return item.name.includes(query);
      })
    );
  }, [query, items]);

  // 최근검색 추가
  const addRecent = (item: Item) => {
    let newRecent = [item, ...recent.filter((i) => i.id !== item.id)];
    if (newRecent.length > 10) newRecent = newRecent.slice(0, 10);
    setRecent(newRecent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
  };

  // 즐겨찾기 토글
  const toggleFavorite = (item: Item) => {
    let newFavorite: Item[];
    if (favorite.find((i) => i.id === item.id)) {
      newFavorite = favorite.filter((i) => i.id !== item.id);
    } else {
      newFavorite = [item, ...favorite];
    }
    setFavorite(newFavorite);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(newFavorite));
  };

  // 최근검색 초기화
  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem(RECENT_KEY);
  };

  // 즐겨찾기 초기화
  const clearFavorite = () => {
    setFavorite([]);
    localStorage.removeItem(FAVORITE_KEY);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleItemClick = (item: Item) => {
    addRecent(item);
    router.push(`/item/${item.id}`);
  };

  const renderItem = (item: Item) => (
    <div
      key={item.id}
      className="flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-700 border-b border-zinc-700 last:border-b-0 transition-colors"
      onClick={() => handleItemClick(item)}
    >
      <div className="flex items-center">
        <ItemIcon id={item.id} size={32} />
        <span>{item.name}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(item);
        }}
        onMouseDown={(e) => e.preventDefault()}
        className="ml-2 text-yellow-400"
        title={
          favorite.find((i) => i.id === item.id) ? "즐겨찾기 해제" : "즐겨찾기"
        }
      >
        {favorite.find((i) => i.id === item.id) ? "★" : "☆"}
      </button>
    </div>
  );

  // 검색창 포커스/블러 핸들링
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
      setQuery("");
    }, 120);
  };

  // 검색어가 비어있고 포커스가 있으면 최근/즐겨찾기, 검색어가 있으면 검색결과만
  const showRecentAndFavorite = isInputFocused && query.trim() === "";
  const showResults = isInputFocused && query.trim() !== "";

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="w-full relative" ref={containerRef}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="아이템 검색"
          className="w-full p-3 text-lg rounded bg-zinc-900 text-white outline-none mb-2"
          autoFocus
        />
        {/* 최근검색/즐겨찾기 패널 */}
        {showRecentAndFavorite && (
          <div
            className="absolute left-0 right-0 z-10 flex gap-4 bg-transparent transition-opacity duration-300 opacity-100"
            style={{ top: "calc(100% + 4px)" }}
          >
            {/* 최근검색 */}
            <div className="flex-1 bg-zinc-800 rounded p-2 overflow-y-auto">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-400">최근검색</span>
                <button
                  onClick={clearRecent}
                  onMouseDown={(e) => e.preventDefault()}
                  className="text-xs text-zinc-400 hover:text-red-400"
                >
                  초기화
                </button>
              </div>
              {recent.length === 0 ? (
                <div className="text-zinc-500 text-sm">없음</div>
              ) : (
                recent.map(renderItem)
              )}
            </div>
            {/* 즐겨찾기 */}
            <div className="flex-1 bg-zinc-800 rounded p-2 overflow-y-auto">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-400">즐겨찾기</span>
                <button
                  onClick={clearFavorite}
                  onMouseDown={(e) => e.preventDefault()}
                  className="text-xs text-zinc-400 hover:text-red-400"
                >
                  초기화
                </button>
              </div>
              {favorite.length === 0 ? (
                <div className="text-zinc-500 text-sm">없음</div>
              ) : (
                favorite.map(renderItem)
              )}
            </div>
          </div>
        )}
        {/* 검색결과 패널 */}
        {showResults && (
          <div
            className="absolute left-0 right-0 z-10 bg-zinc-800 text-white rounded max-h-72 overflow-y-auto shadow-lg w-full transition-opacity duration-300 opacity-100"
            style={{ top: "calc(100% + 4px)" }}
          >
            {results.map(renderItem)}
          </div>
        )}
      </div>
    </div>
  );
}
