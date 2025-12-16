import type { NextConfig } from "next";

export default {
  experimental: {
    inlineCss: true,
  },
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
} satisfies NextConfig;
