import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // THIS IS THE FIX
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "healthacademy.ca",
        port: "",           // leave empty
        pathname: "/**",    // allow all paths under your domain
      },
    ],
    // Optional: also allow localhost for dev
    domains: ["localhost"], // old way – kept for compatibility
  },
};

export default nextConfig;
