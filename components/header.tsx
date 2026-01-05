import { Bookmark, Library, Menu, X } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { existsFile } from "@/lib/validator";
import ThemeChanger from "./theme-changer";
import UserAvatar from "./user-avatar";

export default function Header() {
  const session = use(auth());
  const didLogin = !!session?.user;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-border/50 border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Bookmark className="h-5 w-5 text-primary" />
              </div>
            </div>
            <span className="font-bold font-display text-xl">
              <span className="text-foreground">S</span>
              <span className="gradient-text">BM</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/bookcase"
              className="link-underline font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              대시보드
            </Link>
            <Link
              href="#explore"
              className="link-underline font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              탐색하기
            </Link>
            <Link
              href="#pricing"
              className="link-underline font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              요금제
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            {didLogin ? (
              // 'session.user?.name
              <Link href="/my" className="relative overflow-hidden rounded-full border">
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
              <Link href="/sign">
                <Button variant="hero" size="sm">
                  무료로 시작하기
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
