import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P, VT323, Silkscreen } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelPrimary = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel-primary",
  subsets: ["latin"],
});

const pixelSecondary = VT323({
  weight: "400",
  variable: "--font-pixel-secondary",
  subsets: ["latin"],
});

const pixelAccent = Silkscreen({
  weight: "400",
  variable: "--font-pixel-accent",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Code Adventure RPG — Learn Coding Through Adventure",
    template: "%s | Code Adventure RPG",
  },
  description:
    "A gamified coding learning platform where you solve programming problems, level up your character, defeat bosses, and explore a fantasy world.",
  keywords: [
    "coding",
    "programming",
    "learning",
    "RPG",
    "gamification",
    "algorithms",
    "data structures",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelPrimary.variable} ${pixelSecondary.variable} ${pixelAccent.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
        <div className="crt-overlay" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
