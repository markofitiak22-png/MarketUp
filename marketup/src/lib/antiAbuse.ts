import crypto from "node:crypto";

export function normalizeIpForHash(ip: string | null | undefined): string {
  if (!ip) return "";
  // Remove IPv6 zone ids and brackets
  const trimmed = ip.replace(/%\w+$/, "").replace(/[\[\]]/g, "");
  return trimmed.trim();
}

export function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hashUserAgent(userAgent: string | undefined): string | null {
  if (!userAgent) return null;
  return hashValue(userAgent);
}

export function createFingerprintFromParts(parts: Array<string | null | undefined>): string {
  const joined = parts.filter(Boolean).join("|");
  return hashValue(joined);
}


