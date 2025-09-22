import { redirect } from "next/navigation";
import { use } from "react";
import { auth } from "@/lib/auth";

export default function Bookcase() {
  const session = use(auth());
  const didLogin = !!session?.user?.email;

  console.log("🚀 ~ session:", session?.user);
  console.log("sss1", session?.user?.email); // -> 값이 없다면 undefined 있다면 email 주소
  console.log("sss2", !session?.user?.email); // -> 값이 없다면 true  있다면 false
  console.log("sss3", !!session?.user?.email); // -> 값이 없다면 false  있다면 true

  if (!session?.user?.name) redirect("/");

  const nickname = encodeURI(session.user.name);
  console.log("🚀 ~ nickname:", nickname);
  redirect(didLogin ? `/bookcase/${nickname}` : "/");
}
