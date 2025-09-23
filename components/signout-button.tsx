"use client";

import { LogOutIcon } from "lucide-react";
import { logout } from "@/app/sign/sign.action";
import { Button } from "./ui/button";

export default function SignOutButton({ name }: { name: string }) {
  // session provider가 제공해줌
  // const session = useSession();

  // if (!session?.data?.user) redirect("/");

  return (
    <form action={logout}>
      <Button variant={"success"}>
        <LogOutIcon />
        로그아웃 {name}
      </Button>
    </form>
  );
}
