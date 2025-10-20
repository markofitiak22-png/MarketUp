import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import HeaderGate from "@/components/HeaderGate";
import FooterGate from "@/components/FooterGate";
import RememberMeHandler from "@/components/RememberMeHandler";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <RememberMeHandler />
          <HeaderGate />
          <main>{children}</main>
          <FooterGate />
        </Providers>
      </body>
    </html>
  );
}
