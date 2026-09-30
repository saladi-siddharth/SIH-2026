import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dtbvlvkyqizgmqsnstxv.supabase.co",
      },
    ],
  },
};

export default nextConfig;
