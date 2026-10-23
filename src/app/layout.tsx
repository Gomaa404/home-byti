import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "إدارة أملاك - ابراج",
  description: "المنظومة المتكاملة لإدارة الأصول والوحدات الفندقية والسكنية بالمملكة",
  icons: {
    icon: [
      { url: `${APP_CONFIG.basePath}/favicon.ico`, sizes: "any" },
      { url: `${APP_CONFIG.basePath}/favicon-32x32.png`, type: "image/png", sizes: "32x32" },
      { url: `${APP_CONFIG.basePath}/favicon-16x16.png`, type: "image/png", sizes: "16x16" },
      { url: `${APP_CONFIG.basePath}/icon.png`, type: "image/png", sizes: "512x512" },
      { url: `${APP_CONFIG.basePath}/logo.png`, type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: `${APP_CONFIG.basePath}/apple-icon.png`, sizes: "180x180", type: "image/png" },
    ],
    shortcut: `${APP_CONFIG.basePath}/favicon.ico`,
  },
};

import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lucide-static@1.59.0/font/lucide.css"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#EFF2EB] text-[#252A24]"
      >
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
