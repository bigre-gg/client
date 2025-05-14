import { cookies } from "next/headers";
import ProfileDropdown from "./profile-dropdown";

export default function Header() {
  const cookieStore = cookies();
  const session = cookieStore.get("connect.sid");
  const isLoggedIn = !!session;

  return (
    <header className="w-full flex justify-end items-center h-16 px-6">
      {!isLoggedIn ? (
        <a href="/api/auth/discord">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            로그인
          </button>
        </a>
      ) : (
        <ProfileDropdown />
      )}
    </header>
  );
}
