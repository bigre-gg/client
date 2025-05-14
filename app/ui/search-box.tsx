"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [results, setResults] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/items.json")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    setResults(
      items.filter((item) => {
        // 일반 검색
        if (item.name.includes(query)) return true;
        // 초성 검색
        if (getChosung(item.name).includes(query)) return true;
        return false;
      })
    );
  }, [query, items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleItemClick = (id: number) => {
    router.push(`/item/${id}`);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
      }}
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="아이템 검색"
        className="w-full p-3 text-lg rounded bg-zinc-900 text-white outline-none"
        autoFocus
      />
      <div className="bg-zinc-800 text-white mt-2 rounded max-h-72 overflow-y-auto shadow-lg">
        {results.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="p-3 cursor-pointer hover:bg-zinc-700 border-b border-zinc-700 last:border-b-0"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
