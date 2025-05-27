"use client";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import ProfileDropdown from "./profile-dropdown";
import Image from "next/image";
import SearchBox from "./search-box";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <>
      <header className="w-full flex flex-col items-center h-auto bg-lightBg dark:bg-darkBg text-darkBg dark:text-lightBg border-b border-zinc-400 dark:border-zinc-700 z-50">
        <div className="w-full max-w-6xl flex flex-row justify-between items-center px-2 sm:px-6 h-auto min-h-[56px]">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="메인페이지로 이동"
          >
            <Image
              src="/favicon.png"
              alt="로고"
              width={36}
              height={36}
              className="object-scale-down w-auto h-8"
            />
            <span className="font-bold text-lg tracking-tight select-none">
              빅리지지
            </span>
          </Link>
          {usePathname() !== "/" && (
            <div className="hidden sm:flex flex-1 justify-center">
              <SearchBox variant="header" />
            </div>
          )}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="다크/라이트 모드 토글"
              className="mr-1 p-2 rounded-full border border-gray-400 dark:border-gray-700 bg-lightBg dark:bg-darkBg hover:bg-gray-200 dark:hover:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={() => (window.location.href = "/notice")}
              aria-label="공지사항"
              className="mr-2 p-2 rounded-full border border-gray-400 dark:border-gray-700 bg-lightBg dark:bg-darkBg hover:bg-gray-200 dark:hover:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <QuestionMarkCircleIcon className="w-5 h-5 text-blue-500" />
            </button>
            {!isLoggedIn ? (
              <a href="/api/auth/discord">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition bg-[#5865f2] hover:bg-[#4752C4] h-8">
                  <img
                    src="/discord-logo.png"
                    alt="Discord Logo"
                    className="object-contain w-auto h-5"
                  />
                  <span className="text-white text-sm">로그인</span>
                </button>
              </a>
            ) : (
              <ProfileDropdown buttonClassName="flex items-center gap-2 px-3 py-1.5 rounded-lg transition bg-[#5865f2] hover:bg-[#4752C4] h-8" />
            )}
          </div>
        </div>
      </header>
      {usePathname() !== "/" && (
        <div className="flex sm:hidden w-full justify-center m-0 p-0">
          <SearchBox variant="header" />
        </div>
      )}
    </>
  );
}
