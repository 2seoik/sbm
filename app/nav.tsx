import { SquareLibrary } from "lucide-react";
import Link from "next/link";

export default function Nav() {
  return (
    <div className="flex items-center gap-5">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibrary size={28} />
      </Link>
      <Link href="/my">My</Link>
      <Link href="/sign">SignIn</Link>
    </div>
  );
}
