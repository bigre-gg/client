"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface UserData {
  id: string;
  username: string;
  globalName: string;
  email: string;
  avatar: string | null;
}

export default function ProfileDropdown({
  buttonClassName,
}: {
  buttonClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserData | null>(null);

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

  // 유저 정보 가져오기 (예시: 실제 구현 필요)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/status", {
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          console.log("Fetched user data successfully:", userData);
          if (userData.user) {
            setUser(userData.user);
          } else {
            setUser(null);
          }
        } else {
          // 응답이 정상이 아닐 때 상태 코드와 텍스트를 콘솔에 출력
          const errorText = await res.text();
          console.error(
            `Failed to fetch user status: ${res.status} - ${errorText}`
          );
          setUser(null); // 에러 발생 시 user 상태를 null로 설정
        }
      } catch (error) {
        console.error("Error during fetch user status:", error);
        setUser(null);
      }
    };

    // 이 컴포넌트는 로그인 상태일 때만 렌더링되므로 바로 fetch
    fetchUser();
  }, []); // 빈 배열은 마운트 시 한 번만 실행

  return (
    <div className="relative" ref={dropdownRef}>
      <button className={buttonClassName} onClick={() => setOpen((v) => !v)}>
        {/* 임시 디스코드 아이콘 */}
        <img
          src="/discord-logo.png"
          alt="Discord Logo"
          className="object-contain w-auto h-5"
        />
        {/* 유저 닉네임 표시 */}
        <span className="text-white text-sm">
          {user ? user.globalName : "로그인"}
        </span>
      </button>
      {open && user && (
        <div
          className={
            "absolute right-0 mt-2 w-full bg-lightBg dark:bg-darkBg text-darkBg dark:text-lightBg border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg z-10 overflow-hidden transform transition-all ease-out duration-200 " +
            (open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
          }
        >
          <a
            href="/profile"
            className="block px-4 py-2 text-darkBg dark:text-lightBg hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            프로필
          </a>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="block w-full text-left px-4 py-2 text-darkBg dark:text-lightBg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              로그아웃
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
