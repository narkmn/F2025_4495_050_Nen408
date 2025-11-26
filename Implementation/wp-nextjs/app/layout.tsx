// app/layout.tsx
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { getPrimaryMenu } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";


const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
});

// ──────────────────────────────────────────────────────────────
// Metadata + Favicons (kills the black N forever)
// ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Natural Health Academy",
    template: "%s | Natural Health Academy",
  },
  description: "Advanced Nutrition & Holistic Health Courses",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = await getPrimaryMenu();
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${rubik.variable}`}>
      {/* Proper way to load Swiper CSS globally in Next.js 13+ */}
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body className="font-rubik antialiased bg-white text-gray-900">
        <Navbar items={menuItems } isLoggedIn={!!user} userName={user?.username || "Student"} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}