import { BookMarkedIcon } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import ThemeChanger from "@/components/theme-changer";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/lib/auth";
import "./globals.css";
import Nav from "./nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book & Mark",
  description: "Social BookMark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="container mx-auto flex h-screen flex-col justify-center border">
              <header className="flex justify-between border border-b-4 border-b-amber-500">
                <Link
                  href="/"
                  className="flex items-center font-semibold text-3xl text-zinc-800 tracking-tight"
                >
                  <BookMarkedIcon size={28} />
                  Book & Mark
                </Link>
                <Nav />
              </header>
              <main className="flex-1"> {children}</main>
              <footer>
                <div className="flex justify-between">
                  <div className="text-zinc-500">&#169; shlee 2025</div>
                  <div>
                    <ThemeChanger />
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
