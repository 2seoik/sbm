import { BookMarkedIcon, SquareLibrary } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container mx-auto flex h-screen flex-col justify-center border">
          <header className="flex justify-between border border-b-4 border-b-amber-300">
            <Link
              href="/"
              className="flex items-center font-semibold text-3xl text-blue-800 tracking-tight"
            >
              <BookMarkedIcon size={28} />
              BookMark
            </Link>
            {/* nav */}
            <div className="flex items-center gap-5">
              <Link
                href="/bookcase"
                className="rounded-full border border-blue-300 p-1 transition-all duration-100 hover:ring-1 hover:ring-blue-500 active:scale-75"
              >
                <SquareLibrary size={28} />
              </Link>
              <Link href="/my">My</Link>
              <Link href="/sign">SignIn</Link>
            </div>
          </header>
          <main className="flex-1"> {children}</main>
          <footer className="text-center text-green-500">
            &#169; shlee 20205
          </footer>
        </div>
      </body>
    </html>
  );
}
