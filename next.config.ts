import type { NextConfig } from "next";

const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  output: isExport ? "export" : "standalone",
  trailingSlash: isExport ? true : false,
  ...(isExport ? { images: { unoptimized: true } } : {}),
};

export default nextConfig;
