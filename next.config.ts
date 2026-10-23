import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: isDev ? undefined : "export",
  basePath: "/Edaret_Amlak",
  assetPrefix: "/Edaret_Amlak",
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
              destination: "/Edaret_Amlak/logo.png",
              basePath: false,
              permanent: false,
            },
            {
              source: "/avatar.webp",
              destination: "/Edaret_Amlak/avatar.webp",
              basePath: false,
              permanent: false,
            },
            {
              source: "/properties/:path*",
              destination: "/Edaret_Amlak/properties/:path*",
              basePath: false,
              permanent: false,
            },
            {
              source: "/icon.png",
              destination: "/Edaret_Amlak/icon.png",
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
              destination: "/Edaret_Amlak/dashboard/",
              basePath: false,
              permanent: false,
            },
            {
              source: "/",
              destination: "/Edaret_Amlak/login/",
              basePath: false,
              permanent: false,
            },
            {
              source: "/favicon.ico",
              destination: "/Edaret_Amlak/favicon.ico",
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
