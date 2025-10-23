import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ tier: z.enum(["BASIC", "STANDARD", "PREMIUM"]) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const { tier } = parsed.data;

  const now = new Date();
  const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30d

  // Cancel existing active subs
  await prisma.subscription.updateMany({
    where: { userId: user.id, status: "ACTIVE" },
    data: { status: "CANCELED", cancelAtPeriodEnd: true },
  });

  const sub = await prisma.subscription.create({
    data: {
      userId: user.id,
      tier: tier as "BASIC" | "STANDARD" | "PREMIUM",
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: end,
    },
  });

  return NextResponse.json({ ok: true, subscription: sub });
}


