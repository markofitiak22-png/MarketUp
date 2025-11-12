import type { Metadata } from "next";
import "../globals.css";
import Providers from "@/components/Providers";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Panel — MarketUp",
  description: "MarketUp Admin Panel - Manage your platform",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </Providers>
  );
}
