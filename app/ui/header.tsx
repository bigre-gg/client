import { cookies } from "next/headers";
import Header from "./header-client";

export default function HeaderWrapper() {
  const cookieStore = cookies();
  const session = cookieStore.get("connect.sid");
  const isLoggedIn: boolean = !!session;
  return <Header isLoggedIn={isLoggedIn} />;
}
