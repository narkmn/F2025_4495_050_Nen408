// components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

// Types
type MenuItem = {
  id: string;
  label: string;
  href: string;
};

type NavbarProps = {
  items: MenuItem[];
  isLoggedIn?: boolean;
  userName?: string;
};

export default function Navbar({
  items,
  isLoggedIn = false,
  userName = "You",
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm w-full navbar-font">
      <div className="max-w-[1170px] mx-auto px-6 h-[110px] flex items-center justify-between">

        {/* LEFT — Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="https://healthacademy.ca/wp-content/uploads/2025/03/cropped-cropped-HEALTH-ACADEMY-IG-Happy-Nutrition-8.png"
              alt="Happy Nutrition Academy"
              width={103}
              height={103}
              className="h-[103px] w-auto"
              priority
            />
          </Link>
        </div>

        {/* CENTER — Menu (True WordPress alignment) */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-10">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  font-[700]
                  text-[1.1em]
                  px-2
                  py-[1.04em]
                  ${isActive ? "text-[#5EA758]" : "text-[#00081A]"}
                  hover:text-[#5EA758]
                  transition-colors
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT — Dashboard/Login */}
        <div className="flex-shrink-0 flex items-center space-x-3">

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="
                bg-[#5EA758]
                hover:bg-[#5EA758]/90
                text-white font-[500]
                text-[1.1em]
                px-6 py-3
                rounded-[6px]
                shadow-[2px_2px_1px_-7px_rgba(0,0,0,0.4)]
                hover:shadow-[0px_15px_25px_-7px_rgba(0,0,0,0.35)]
                transition-all duration-200
                whitespace-nowrap
              "
            >
              Your Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="
                bg-[#5EA758]
                hover:bg-[#5EA758]/90
                text-white font-[500]
                text-[1.1em]
                px-6 py-3
                rounded-[6px]
                shadow-[2px_2px_1px_-7px_rgba(0,0,0,0.4)]
                hover:shadow-[0px_15px_25px_-7px_rgba(0,0,0,0.35)]
                transition-all duration-200
                whitespace-nowrap
              "
            >
              Log In
            </Link>
          )}

          {/* Mobile Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">

            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#5EA758] hover:bg-green-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 pb-3 border-t border-gray-200">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="block w-full text-center bg-[#5EA758] hover:bg-[#5EA758]/90 text-white px-6 py-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center bg-[#5EA758] hover:bg-[#5EA758]/90 text-white px-6 py-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
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
