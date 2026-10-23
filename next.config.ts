import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/dashboard";

const nextConfig: NextConfig = {
  output: isDev ? undefined : "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  ...(isDev
    ? {
        async redirects() {
          return [
            {
              source: "/logo.png",
              destination: `${basePath}/logo.png`,
              basePath: false,
              permanent: false,
            },
            {
              source: "/avatar.webp",
              destination: `${basePath}/avatar.webp`,
              basePath: false,
              permanent: false,
            },
            {
              source: "/properties/:path*",
              destination: `${basePath}/properties/:path*`,
              basePath: false,
              permanent: false,
            },
            {
              source: "/icon.png",
              destination: `${basePath}/icon.png`,
              basePath: false,
              permanent: false,
            },
            {
              source: "/",
              has: [
                {
                  type: "cookie",
                  key: "realestate_auth",
                },
              ],
              destination: `${basePath}/`,
              basePath: false,
              permanent: false,
            },
            {
              source: "/",
              destination: `${basePath}/login/`,
              basePath: false,
              permanent: false,
            },
            {
              source: "/favicon.ico",
              destination: `${basePath}/favicon.ico`,
              basePath: false,
              permanent: false,
            },
          ];
        },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
