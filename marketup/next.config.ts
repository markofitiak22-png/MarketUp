import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Silence workspace root tracing warning when multiple lockfiles exist
    outputFileTracingRoot: path.join(__dirname),
  },
};

export default nextConfig;
