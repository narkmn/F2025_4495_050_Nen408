"use client";
import { useState } from "react";
import Link from "next/link";

export default function AboutSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-12">

        <h2 className="text-4xl md:text-5xl font-heading text-[#0F223A] text-center">
          About Us
        </h2>

        <div className="w-24 h-[2px] bg-gray-300 mx-auto mt-4 mb-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div
            className="relative w-full rounded-xl overflow-hidden shadow-lg group"
          >
            {/* Thumbnail + Play button (only when NOT playing) */}
            {!isPlaying && (
              <div
                className="relative w-full h-64 md:h-[380px] cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                {/* Thumbnail */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://healthacademy.ca/wp-content/uploads/2025/03/health.png')",
                  }}
                />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center text-[#0F223A] text-3xl group-hover:scale-110 transition">
                    ▶
                  </div>
                </div>
              </div>
            )}

            {/* VIDEO — ONLY rendered when playing */}
            {isPlaying && (
              <video
                className="w-full h-64 md:h-[380px] object-cover"
                src="https://healthacademy.ca/wp-content/uploads/2024/11/FINAL-1.mp4"
                controls
                autoPlay
              />
            )}
          </div>

          {/* RIGHT SIDE */}
          <div>
            <p className="text-gray-700 leading-relaxed text-lg mb-8">
              Welcome to the Natural Health Academy, where we’re passionate about empowering
              individuals with the knowledge and skills to take charge of their health through
              natural, evidence-based approaches...
            </p>

            <Link
              href="/about"
              className="inline-flex items-center bg-green-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-800 transition"
            >
              Read Our Story
              <span className="ml-2 text-lg">›</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
