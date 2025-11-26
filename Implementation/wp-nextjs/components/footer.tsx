// components/Footer.tsx
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Navigation Links */}
        <div className="text-center mb-8">
          <nav className="inline-flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-600 font-medium">
            <Link 
              href="/about" 
              className="hover:text-gray-900 transition"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="hover:text-gray-900 transition"
            >
              Contact Us
            </Link>
            <Link 
              href="/legal-disclaimer" 
              className="hover:text-gray-900 transition"
            >
              Legal Disclaimer
            </Link>
            <Link 
              href="/privacy-policy" 
              className="hover:text-gray-900 transition"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-of-use" 
              className="hover:text-gray-900 transition"
            >
              Terms of Use
            </Link>
          </nav>
        </div>

        {/* Divider Line */}
        <div className="w-full max-w-2xl mx-auto border-t border-gray-300 mb-8" />

        {/* Bottom Row: Copyright + Social */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500">
          {/* Copyright */}
          <p className="mb-4 sm:mb-0">
            © {currentYear} Happy Nutrition LTD. All rights reserved.
          </p>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/happynutritionhealth/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="Follow us on Instagram"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}