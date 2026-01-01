import { ArrowRightIcon, BookMarkedIcon, GlobeIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AlerterProvider } from "@/hooks/contexts/alerter";
import { StoreProvider } from "@/hooks/contexts/store";
import { auth } from "@/lib/auth";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Nav from "./nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
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
      <body className={`${inter.variable} ${sora.variable} antialiased`}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AlerterProvider>
              <StoreProvider>
                <div className="min-h-screen bg-background">
                  <Header />
                  <div>{children}</div>
                  <Footer />
                </div>
              </StoreProvider>
            </AlerterProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
