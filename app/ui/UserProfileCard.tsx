"use client";

import React from "react";
import Link from "next/link";

interface UserProfileCardProps {
  user: any;
  onReport?: () => void;
  onProfileClick?: () => void;
}

export default function UserProfileCard({
  user,
  onReport,
  onProfileClick,
}: UserProfileCardProps) {
  // 가입일(유저 가입일)
  const userCreatedAt = user?.createdAt ? new Date(user.createdAt) : null;
  const userCreatedAtStr = userCreatedAt
    ? `${userCreatedAt.getFullYear()}.${
        userCreatedAt.getMonth() + 1
      }.${userCreatedAt.getDate()} ${userCreatedAt.getHours()}:${userCreatedAt
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : "-";
  return (
    <>
      <div className="w-full md:w-72 bg-white dark:bg-[#23272f] rounded-2xl shadow p-6 flex flex-col items-center border border-gray-200 dark:border-zinc-700 relative">
        <img
          src={
            user?.avatar
              ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/0.png`
          }
          className="w-20 h-20 rounded-full mb-3 border-2 border-gray-400 mt-2"
          alt="avatar"
        />
        <div className="text-lg text-black dark:text-white mb-1">
          {user?.globalName}
        </div>
        <div className="flex items-center mb-1">
          <img src="/ticket.png" alt="티켓" className="w-5 h-5 mr-1" />
          <span className="text-base text-black dark:text-white">
            {user?.ticket ?? 0}/30
          </span>
          <span className="relative ml-1 group cursor-pointer">
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-gray-400 inline-block align-middle"
            >
              <circle cx="10" cy="10" r="10" fill="#e5e7eb" />
              <text
                x="10"
                y="15"
                textAnchor="middle"
                fontSize="13"
                fill="#6b7280"
                fontWeight="bold"
              >
                ?
              </text>
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 -top-14 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150 flex flex-col items-center">
              <span className="mb-0 bg-gray-800 text-white px-3 py-2 rounded shadow-lg border border-gray-700 max-w-xs min-w-[180px] break-words flex flex-col items-center">
                <span className="font-bold text-sm mb-1 whitespace-nowrap">
                  팝니다, 삽니다 등록 시 단풍 1개가 소모되며,
                </span>
                <span className="font-bold text-sm mb-1 whitespace-nowrap">
                  거래 완료 또는 취소 시 1개가 회수됩니다.
                </span>
              </span>
            </span>
          </span>
        </div>
        <div className="text-sm text-gray-500 mb-1">
          {user?.username ? `@${user.username}` : null}
        </div>
        <div className="text-xs text-gray-400 mb-2">
          가입일: {userCreatedAtStr}
        </div>
        {/* 디스코드 아이디 복사 */}
        {user?.discordId && (
          <div className="w-full flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-gray-500 select-all">
              {user.discordId}
            </span>
            <button
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700"
              title="디스코드 아이디 복사"
              onClick={() => {
                navigator.clipboard.writeText(user.discordId);
              }}
            >
              {/* Heroicons ClipboardIcon (outline) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6.75V5.25A2.25 2.25 0 0014.25 3h-4.5A2.25 2.25 0 007.5 5.25v1.5M12 12v6m0 0l-2.25-2.25M12 18l2.25-2.25M4.5 6.75A2.25 2.25 0 006.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V6.75z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
