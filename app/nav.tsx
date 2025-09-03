import { LogInIcon, SquareLibrary } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { auth } from "@/lib/auth";

export default function Nav() {
  const session = use(auth());
  const didLogin = !!session?.user;

  return (
    <div className="flex items-center gap-5 py-1">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibrary size={28} />
      </Link>
      {didLogin ? (
        <Link href="/my">{session.user?.name}</Link>
      ) : (
        <Link href="/sign" className="btn-icon">
          <LogInIcon />
        </Link>
      )}
    </div>
  );
}
