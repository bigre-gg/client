import { notFound } from "next/navigation";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import ItemDetailBody from "@/app/ui/item-detail-body";

export default async function ItemDetail({
  params,
}: {
  params: { id: string };
}) {
  // public 폴더의 items.json을 읽음
  const filePath = path.join(process.cwd(), "public", "items.json");
  const data = fs.readFileSync(filePath, "utf-8");
  const items: any[] = JSON.parse(data);
  const item = items.find((i) => i.id === Number(params.id));
  if (!item) return notFound();
  return (
    <div className="flex flex-row" style={{ minHeight: 400 }}>
      <div style={{ minWidth: 320, maxWidth: 320 }}>
        <ItemDetailBody item={item} cardSize={320} />
      </div>
      <div className="flex-1" />
    </div>
  );
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const { params } = await props;
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
