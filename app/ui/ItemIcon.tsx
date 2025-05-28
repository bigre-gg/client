"use client";

export default function ItemIcon({
  id,
  size = 32,
  disableDarkBg = false,
}: {
  id: number;
  size?: number;
  disableDarkBg?: boolean;
}) {
  // 예외 아이템: id별로 public 이미지 직접 사용
  const specialIcons: Record<number, string> = {
    101: "/bronzeCoin.png",
    102: "/silverCoin.png",
    103: "/goldCoin.png",
    200: "/miracleCube.png",
    300: "/highPerformanceSpeaker.png",
  };
  const src =
    specialIcons[id] || `https://maplestory.io/api/gms/123/item/${id}/icon`;
  return (
    <div
      className={disableDarkBg ? "bg-lightBg" : "bg-lightBg dark:bg-darkBg"}
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginRight: 12,
      }}
    >
      <img
        src={src}
        alt="아이템 아이콘"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        loading="lazy"
      />
    </div>
  );
}
