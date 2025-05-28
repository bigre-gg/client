"use client";
import Link from "next/link";

const notices = [
  { href: "/notice/trade-register", title: "거래 등록 안내" },
  { href: "/notice/trade-manage", title: "거래 관리 안내" },
  { href: "/notice/rule", title: "이용 규칙" },
  { href: "/notice/discord", title: "디스코드 관련 안내" },
  { href: "/notice/ask", title: "문의/신고 안내" },
];

export default function NoticePage() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">공지사항</h1>
      <ul className="space-y-4">
        {notices.map((notice) => (
          <li key={notice.href}>
            <Link
              href={notice.href}
              className="block p-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#23272f] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-lg font-semibold text-blue-700 dark:text-blue-300"
            >
              {notice.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
