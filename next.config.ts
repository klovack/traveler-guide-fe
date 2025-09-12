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
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  redirects: async () => {
    return [
      {
        source: "/guide/onboarding",
        destination: "/guide/onboarding/step-1",
        permanent: true,
      },
      {
        source: "/guide/preview",
        destination: "/guide/preview/me",
        permanent: false,
      }
    ];
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
