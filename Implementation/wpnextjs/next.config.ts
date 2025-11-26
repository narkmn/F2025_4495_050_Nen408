// next.config.ts  (or next.config.js)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "healthacademy.ca",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.healthacademy.ca", // for subdomains if any
        pathname: "/**",
      },
      // Optional: dev only – allows images from WP when running locally
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;