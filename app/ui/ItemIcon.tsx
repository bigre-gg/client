"use client";

export default function ItemIcon({
  id,
  size = 32,
}: {
  id: number;
  size?: number;
}) {
  // 클라이언트에서 직접 외부 이미지 서버로 요청
  const src = `https://maplestory.io/api/gms/123/item/${id}/icon`;
  return (
    <div
      className="bg-lightBg dark:bg-darkBg"
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
