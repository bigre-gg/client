import { cookies } from "next/headers";
import Header from "./header-client";

export default async function HeaderWrapper() {
  const cookieStore = await cookies();
  const session = await cookieStore.get("connect.sid");
  const isLoggedIn: boolean = !!session;
  return <Header isLoggedIn={isLoggedIn} />;
}
