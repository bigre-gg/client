import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SearchBox from "./ui/search-box";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black">
      <SearchBox />
    </main>
  );
}
