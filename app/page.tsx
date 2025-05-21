import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SearchBox from "./ui/search-box";
import Image from "next/image";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-lightBg dark:bg-darkBg text-darkBg dark:text-lightBg">
      <Image
        src="/logo.png"
        width={200}
        height={100}
        alt="로고"
        className="mx-auto mt-12 mb-6"
      />
      <SearchBox />
    </main>
  );
}
