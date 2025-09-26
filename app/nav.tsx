import { LogInIcon, SquareLibrary } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { auth } from "@/lib/auth";
import DummyProfiie from "@/public/profile_dummy.png";
import ProfileImage from "./my/profile-image";

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
          className="relative h-[40px] w-[40px] overflow-hidden rounded-full border"
        >
          <ProfileImage
            src={session.user?.image || DummyProfiie}
            alt={session.user?.name || "guest"}
            unoptimized={process.env.NODE_ENV === "development"}
            fill
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
