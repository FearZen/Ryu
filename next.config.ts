import type { NextConfig } from "next";

console.log("Loading next.config.ts...");

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oajylahnjncfinpoypup.supabase.co',
      },
    ],
  },
};

export default nextConfig;
