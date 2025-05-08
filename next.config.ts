import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip blocking on lint errors
  },
  output: "export", // ✅ Enable support for `next export`
};

export default nextConfig;
