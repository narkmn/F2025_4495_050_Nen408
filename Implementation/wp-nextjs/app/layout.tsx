// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getPrimaryMenu } from "@/lib/queries";


const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
});

const playfair = localFont({
  src: [
    { path: "../public/fonts/playfair-display-v40-latin-regular.woff2",  weight: "400" },
    { path: "../public/fonts/playfair-display-v40-latin-500.woff2",       weight: "500" },
    { path: "../public/fonts/playfair-display-v40-latin-600.woff2",       weight: "600" },
    { path: "../public/fonts/playfair-display-v40-latin-700.woff2",       weight: "700" },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../public/fonts/inter-v20-latin-regular.woff2",  weight: "400" },
    { path: "../public/fonts/inter-v20-latin-500.woff2",      weight: "500" },
    { path: "../public/fonts/inter-v20-latin-600.woff2",      weight: "600" },
    { path: "../public/fonts/inter-v20-latin-700.woff2",      weight: "700" },
  ],
  variable: "--font-inter",
  display: "swap",
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

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${rubik.variable}`}>
      {/* Proper way to load Swiper CSS globally in Next.js 13+ */}
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body className="font-rubik antialiased bg-white text-gray-900">
        <Navbar items={menuItems} />
        <main>{children}</main>
      </body>
    </html>
  );
}