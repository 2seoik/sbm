import { SquareLibrary } from "lucide-react";
import Link from "next/link";
import ThemeChanger from "@/components/theme-changer";

export default function Nav() {
  return (
    <div className="flex items-center gap-5">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibrary size={28} />
      </Link>
      <ThemeChanger />
      <Link href="/my">My</Link>
      <Link href="/sign">SignIn</Link>
    </div>
  );
}
