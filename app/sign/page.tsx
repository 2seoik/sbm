import { BookMarkedIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { SocialLoginButton } from "./(sign-buttons)/social-login-button";
import SignForm from "./sign-form";

type Props = {
  searchParams: Promise<{ redirectTo: string | null }>;
};

export default function Sign({ searchParams }: Props) {
  const { redirectTo } = use(searchParams);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Branding */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div
          className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-accent/10 blur-3xl"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 flex w-full flex-col items-center justify-center p-12">
          <Link href="/" className="mb-12 flex items-center gap-3">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3">
              <BookMarkedIcon className="h-8 w-8 text-primary" />
            </div>
            <span className="font-bold font-heading text-3xl">SBM</span>
          </Link>

          <div className="max-w-md text-center">
            <h2 className="gradient-text mb-4 font-bold font-heading text-3xl">
              브라우저 속에 갇힌
              <br />
              인사이트를 해방하라
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              북마크를 공유하고, 관심사가 비슷한 사람들과 연결되세요. 개발자를 위한 소셜 북마크 플랫폼.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid w-full max-w-sm gap-4">
            {[
              { icon: "📚", text: "컬렉션 공유" },
              { icon: "🔗", text: "팔로우 & 연결" },
              { icon: "✨", text: "큐레이션 & 포크" },
            ].map((item, i) => (
              <div
                key={item.text}
                className="glass flex animate-fade-in items-center gap-4 rounded-xl p-4"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-2">
                <BookMarkedIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold font-heading text-2xl">SBM</span>
            </Link>
          </div>
          <SignForm />
        </div>
      </div>
    </div>
  );
}
