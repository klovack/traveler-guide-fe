import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*", // Proxy to API server
      },
    ];
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
