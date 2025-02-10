import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: 'export' and images.unoptimized
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  },
  reactStrictMode: true,
};

export default nextConfig;
