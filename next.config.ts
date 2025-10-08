import { TRIP_WIZARD_STEPS } from "@/constants/tripWizard";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${baseApiUrl}/api/:path*`, // Proxy to API server
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
      },
      {
        source: "/trip-wizard",
        destination: `/trip-wizard/${TRIP_WIZARD_STEPS[0]}`,
        permanent: true,
      }
    ];
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
