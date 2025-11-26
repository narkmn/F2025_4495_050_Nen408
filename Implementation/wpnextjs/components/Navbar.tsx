"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {
  items: { id: string; label: string; href: string }[];
  isLoggedIn: boolean;   // ← comes from server, not state
  userName: string;      // ← comes from server
};

export default function Navbar({ items, isLoggedIn, userName }: Props) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1170px] mx-auto px-6 h-[110px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="https://healthacademy.ca/wp-content/uploads/2025/03/cropped-cropped-HEALTH-ACADEMY-IG-Happy-Nutrition-8.png"
            alt="Happy Nutrition Academy"
            width={103}
            height={103}
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-10">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`font-bold text-[1.1em] px-2 py-4 ${pathname === item.href ? "text-[#5EA758]" : "text-[#00081A]"} hover:text-[#5EA758]`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Button — 100% correct now */}
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <Link href="/dashboard" className="bg-[#5EA758] hover:bg-[#5EA758]/90 text-white font-medium px-6 py-3 rounded-lg">
              Your Dashboard
            </Link>
          ) : (
            <Link href="/login" className="bg-[#5EA758] hover:bg-[#5EA758]/90 text-white font-medium px-6 py-3 rounded-lg">
              Log In
            </Link>
          )}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {items.map((item) => (
              <Link key={item.id} href={item.href} className="block py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t">
              {isLoggedIn ? (
                <Link href="/dashboard" className="block text-center bg-[#5EA758] text-white py-3 rounded-lg">
                  Your Dashboard
                </Link>
              ) : (
                <Link href="/login" className="block text-center bg-[#5EA758] text-white py-3 rounded-lg">
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}