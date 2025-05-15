import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip blocking on lint errors
  },
  output: "export",            // ✅ Enable static export
  trailingSlash: true,         // ✅ Ensure /user → /user/index.html
};

export default nextConfig;
