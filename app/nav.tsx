import { LogInIcon, SquareLibrary } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { auth } from "@/lib/auth";
import DummyProfiie from "@/public/profile_dummy.png";
export default function Nav() {
  const session = use(auth());
  const didLogin = !!session?.user;

  return (
    <div className="flex items-center gap-5 py-1">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibrary size={28} />
      </Link>
      {didLogin ? (
        // 'session.user?.name
        <Link href="/my" className="overflow-hidden rounded-full border">
          <Image
            src={DummyProfiie}
            alt={session.user?.name || "guest"}
            width={40}
            height={40}
          />
        </Link>
      ) : (
        <Link href="/sign" className="btn-icon">
          <LogInIcon />
        </Link>
      )}
    </div>
  );
}
