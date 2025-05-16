"use client";
import { useState, useRef, useEffect } from "react";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 bg-[#5865F2] text-white px-4 py-2 rounded hover:bg-[#4752C4] transition"
        onClick={() => setOpen((v) => !v)}
      >
        {/* 임시 디스코드 아이콘 */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#5865F2" />
          <path
            d="M17.5 17c-1.2-1-2.3-1-3.5-1s-2.3 0-3.5 1"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse cx="9" cy="13" rx="1" ry="1.5" fill="#fff" />
          <ellipse cx="15" cy="13" rx="1" ry="1.5" fill="#fff" />
        </svg>
        <span>프로필</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
          <a
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
          >
            프로필
          </a>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            >
              로그아웃
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
