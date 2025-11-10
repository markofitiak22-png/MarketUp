"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function HeaderGate() {
  const pathname = usePathname();
  if (pathname === "/auth" || pathname?.startsWith("/auth/") || pathname === "/password/reset" || pathname?.startsWith("/password/") || pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) return null;
  return <Header />;
}


