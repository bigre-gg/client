"use client";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import ProfileDropdown from "./profile-dropdown";

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
    <header className="w-full flex justify-center items-center h-16 bg-lightBg dark:bg-darkBg text-darkBg dark:text-lightBg">
      <div className="w-full max-w-6xl flex justify-end items-center px-6">
        <button
          onClick={toggleTheme}
          onMouseDown={(e) => e.preventDefault()}
          aria-label="다크/라이트 모드 토글"
          className="mr-4 p-2 rounded-full border border-gray-400 dark:border-gray-700 bg-lightBg dark:bg-darkBg hover:bg-gray-200 dark:hover:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isDark ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-700" />
          )}
        </button>
        {!isLoggedIn ? (
          <a href="/api/auth/discord">
            <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
              로그인
            </button>
          </a>
        ) : (
          <ProfileDropdown />
        )}
      </div>
    </header>
  );
}
