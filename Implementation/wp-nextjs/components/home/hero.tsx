"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      // Desktop → Freeze height once (Elementor does this)
      const h = window.innerHeight - 110; // Navbar height
      setFixedHeight(h);
    } else {
      // Mobile → Dynamic responsive
      setFixedHeight(null);
    }
  }, []);

  return (
    <section
      className="relative w-full bg-center bg-cover bg-no-repeat overflow-hidden"
      style={{
        backgroundImage:
          "url('https://healthacademy.ca/wp-content/uploads/2025/01/d6f66398-192b-467a-b4e8-c2df89f2e1be.jpg')",
        height: fixedHeight !== null ? `${fixedHeight}px` : "auto",
        minHeight: fixedHeight === null ? "calc(100vh - 110px)" : undefined,
      }}
    >
      {/* 2 Columns (57.5% / 42.5%) */}
      <div className="max-w-[1350px] mx-auto flex flex-col md:flex-row w-full h-full px-6 lg:px-12">

        {/* LEFT COLUMN — 57.5% */}
        <div className="w-full md:w-[57.5%] flex items-center">
          <div className="w-full">

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-[#0F223A] leading-tight">
              Advanced Nutrition & Holistic Health Courses
            </h1>

            {/* Button */}
            <a
              href="/course-list"
              className="inline-flex items-center bg-green-700 text-white mt-10 px-6 py-3 rounded-md font-semibold hover:bg-green-800 transition whitespace-nowrap max-w-max"
            >
              GET STARTED
              <span className="ml-2 text-lg">›</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN — 42.5% */}
        <div className="relative w-full md:w-[42.5%] flex items-end">

          {/* FULL-WIDTH BOTTOM STATS CARD */}
          <div className="w-full bg-white shadow-xl rounded-xl px-8 py-6 grid grid-cols-3 text-center z-10 mb-4">

            {/* Counter 1 */}
            <div>
              <p className="text-4xl font-semibold text-[#0F223A]">50+</p>
              <p className="text-xs tracking-widest text-gray-500 mt-2">
                STUDENTS LEARNING
              </p>
            </div>

            {/* Counter 2 */}
            <div>
              <p className="text-4xl font-semibold text-[#0F223A]">100+</p>
              <p className="text-xs tracking-widest text-gray-500 mt-2">
                HOURS OF INSTRUCTION
              </p>
            </div>

            {/* Counter 3 */}
            <div>
              <p className="text-4xl font-semibold text-[#0F223A]">10+</p>
              <p className="text-xs tracking-widest text-gray-500 mt-2">
                ACTIVE COURSES
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Spacer so next section does not overlap */}
      <div className="h-24 md:h-40"></div>
    </section>
  );
}
