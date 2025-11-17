import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import HeaderGate from "@/components/HeaderGate";
import FooterGate from "@/components/FooterGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketUp — AI Avatar Video Marketing",
  description: "Create realistic 3D avatar videos with product visuals, fast and easy.",
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" sizes="any" />
        <link rel="icon" href="/logo.jpeg" sizes="16x16" type="image/jpeg" />
        <link rel="icon" href="/logo.jpeg" sizes="32x32" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" sizes="180x180" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <HeaderGate />
          <main>{children}</main>
          <FooterGate />
        </Providers>
      </body>
    </html>
  );
}
