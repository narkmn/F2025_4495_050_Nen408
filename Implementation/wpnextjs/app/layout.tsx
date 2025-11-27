// app/layout.tsx
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { getPrimaryMenu } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/components/AuthContext";


const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
});

// ──────────────────────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Health Academy",
    template: "%s | Health Academy",
  },
  description: "Advanced Nutrition & Holistic Health Courses",
  icons: {
    icon: {
      url:"https://healthacademy.ca/wp-content/uploads/2025/03/cropped-HEALTH-ACADEMY-IG-Happy-Nutrition-8-32x32.png",
      type: "image/png",
      sizes: "32x32",
    },
    apple: {
      url:"https://healthacademy.ca/wp-content/uploads/2025/03/cropped-HEALTH-ACADEMY-IG-Happy-Nutrition-8-32x32.png",
      type: "image/png",
      sizes: "32x32",}
  },
  metadataBase: new URL("https://www.healthacademy.ca"),
  openGraph: {
    title: "Health Academy",
    description:
      "Evidence-based health and nutrition courses, powered by Health Academy.",
    url: "https://your-frontend-domain.com",
    siteName: "Health Academy",
    type: "website",
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
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body className="font-rubik antialiased bg-white text-gray-900">
        <AuthProvider user={user}>
          <Navbar items={ menuItems }/>
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}