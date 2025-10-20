import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeIpForHash, hashValue } from "@/lib/antiAbuse";

// Hidden server-side limits (not exposed to clients)
const DAILY_REDEMPTION_CAP_PER_CODE = 20;
const MAX_REWARDS_PER_CODE = 200;
const MAX_EVENTS_PER_FINGERPRINT_PER_DAY = 2;
const MAX_EVENTS_PER_IP_PER_DAY = 3;

function getHeader(request: Request, name: string): string | null {
  const v = request.headers.get(name);
  return v && v.length > 0 ? v : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body || {};

    if (action === "create_code") {
      const { ownerId } = body as { ownerId: string };
      if (!ownerId) return NextResponse.json({ error: "ownerId required" }, { status: 400 });
      const code = Math.random().toString(36).slice(2, 10).toUpperCase();
      const created = await prisma.referralCode.create({
        data: { ownerId, code },
      });
      return NextResponse.json({ code: created.code, id: created.id });
    }

    if (action === "redeem") {
      const { code, referredUserId } = body as { code: string; referredUserId?: string };
      if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

      const referralCode = await prisma.referralCode.findUnique({ where: { code } });
      if (!referralCode) return NextResponse.json({ error: "invalid code" }, { status: 404 });

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [todayCountForCode, totalRewardForCode] = await Promise.all([
        prisma.referralEvent.count({
          where: { referralCodeId: referralCode.id, createdAt: { gte: todayStart } },
        }),
        prisma.referralEvent.aggregate({
          where: { referralCodeId: referralCode.id, status: { in: ["APPROVED", "PENDING"] } },
          _sum: { rewardGranted: true },
        }),
      ]);

      if (todayCountForCode >= DAILY_REDEMPTION_CAP_PER_CODE) {
        return NextResponse.json({ ok: true });
      }

      if ((totalRewardForCode._sum.rewardGranted || 0) >= MAX_REWARDS_PER_CODE) {
        return NextResponse.json({ ok: true });
      }

      const fingerprint = getHeader(request, "x-fingerprint");
      const ipHashHeader = getHeader(request, "x-ip-hash");
      const clientIp = normalizeIpForHash(getHeader(request as any, "x-client-ip") || getHeader(request, "x-forwarded-for"));
      const ipHash = ipHashHeader || (clientIp ? hashValue(clientIp.split(",")[0]) : null);
      const userAgent = getHeader(request, "user-agent");

      const [fpCountToday, ipCountToday] = await Promise.all([
        fingerprint
          ? prisma.referralEvent.count({
              where: { referredFingerprintHash: fingerprint, createdAt: { gte: todayStart } },
            })
          : Promise.resolve(0),
        ipHash
          ? prisma.referralEvent.count({
              where: { referredIpHash: ipHash, createdAt: { gte: todayStart } },
            })
          : Promise.resolve(0),
      ]);

      if (fpCountToday >= MAX_EVENTS_PER_FINGERPRINT_PER_DAY || ipCountToday >= MAX_EVENTS_PER_IP_PER_DAY) {
        return NextResponse.json({ ok: true });
      }

      const event = await prisma.referralEvent.create({
        data: {
          referrerId: referralCode.ownerId,
          referredUserId: referredUserId || null,
          referralCodeId: referralCode.id,
          referredFingerprintHash: fingerprint,
          referredIpHash: ipHash,
          userAgent: userAgent || undefined,
          status: "PENDING",
          rewardGranted: 0,
        },
      });

      return NextResponse.json({ ok: true, id: event.id });
    }

    return NextResponse.json({ error: "unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


