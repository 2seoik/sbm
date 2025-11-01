import { LogInIcon, SquareLibrary } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import UserAvatar from "@/components/user-avatar";
import { auth } from "@/lib/auth";
import { existsFile } from "@/lib/validator";

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
        <Link
          href="/my"
          className="relative overflow-hidden rounded-full border"
        >
          <UserAvatar
            member={{
              id: Number(session.user.id),
              nickname: session.user.name || "",
              image: existsFile(session.user?.image),
            }}
          />
          {/* <Image
            src={existsFile(session.user?.image) || DummyProfiie}
            alt={session.user?.name || "guest"}
            unoptimized={process.env.NODE_ENV === "development"}
            fill
          /> */}
        </Link>
      ) : (
        <Link href="/sign" className="btn-icon">
          <LogInIcon />
        </Link>
      )}
    </div>
  );
}
