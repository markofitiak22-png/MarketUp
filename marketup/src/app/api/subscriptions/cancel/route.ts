import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!(session as any)?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const now = new Date();
  const updated = await prisma.subscription.updateMany({
    where: { userId: user.id, status: "ACTIVE", currentPeriodEnd: { gt: now } },
    data: { cancelAtPeriodEnd: true },
  });
  return NextResponse.json({ ok: true, updated: updated.count });
}


