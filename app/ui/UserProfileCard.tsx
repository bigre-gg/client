"use client";

import React from "react";

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
    <div className="w-full md:w-72 bg-white dark:bg-[#23272f] rounded-2xl shadow p-6 flex flex-col items-center border border-gray-200 dark:border-zinc-700 relative">
      <img
        src={
          user?.avatar
            ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/0.png`
        }
        className="w-20 h-20 rounded-full mb-3 border-2 border-blue-500 mt-8"
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
      <button
        className="w-full py-2 rounded bg-red-500 text-white font-bold text-base hover:bg-red-600 mb-3"
        onClick={onReport}
      >
        신고하기
      </button>
      <button
        className="w-full py-2 rounded bg-blue-600 text-white font-bold text-base hover:bg-blue-700 mt-4"
        onClick={onProfileClick}
      >
        유저 프로필 보기
      </button>
    </div>
  );
}
