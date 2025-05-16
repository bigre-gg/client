import { notFound } from "next/navigation";
import { Metadata } from "next";
import fs from "fs";
import path from "path";

interface Item {
  id: number;
  name: string;
}

export default async function ItemDetail({
  params,
}: {
  params: { id: string };
}) {
  // public 폴더의 items.json을 읽음
  const filePath = path.join(process.cwd(), "public", "items.json");
  const data = fs.readFileSync(filePath, "utf-8");
  const items: Item[] = JSON.parse(data);
  const item = items.find((i) => i.id === Number(params.id));
  if (!item) return notFound();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      <p className="text-lg">아이템 ID: {item.id}</p>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join(process.cwd(), "public", "items.json");
  const data = fs.readFileSync(filePath, "utf-8");
  const items = JSON.parse(data);
  const item = items.find((i: any) => i.id === Number(params.id));
  if (!item) return { title: "아이템 없음 | 빅뱅리턴즈.GG" };
  return {
    title: `${item.name} | 빅뱅리턴즈.GG`,
  };
}
