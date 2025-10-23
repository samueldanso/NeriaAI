import type { Metadata } from "next";
import localFont from "next/font/local";

import { env } from "@/env";
import "./globals.css";
import { Providers } from "@/components/providers";

const garnett = localFont({
  src: [
    {
      path: "../public/fonts/Garnett-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Garnett-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-garnett",
});

export const metadata: Metadata = {
  title: {
    default: "Neria AI - Human-AI Knowledge Work",
    template: "%s | Neria AI - Human-AI Knowledge Work",
  },
  description:
    "Neria is a decentralized human-AI reasoning platform that transforms AI outputs into permanent, verifiable, and reusable knowledge assets you can trust.",
  keywords: [
    "neria",
    "neria ai",
    "human-ai",
    "knowledge work",
    "expert-validated",
    "reusable",
    "structured knowledge",
  ],
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.NEXT_PUBLIC_APP_URL,
    title: "Neria  AI - Human-AI Knowledge Work",
    description:
      "Neria is a decentralized human-AI reasoning platform that transforms AI outputs into permanent, verifiable, and reusable knowledge assets you can trust.",
    siteName: "Neria AI - Human-AI Knowledge Work",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neria AI - Human-AI Knowledge Work",
    description:
      "Neria is a decentralized human-AI reasoning platform that transforms AI outputs into permanent, verifiable, and reusable knowledge assets you can trust.",
    site: "@neriaai",
    creator: "@neriaai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${garnett.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
