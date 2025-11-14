import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session as any)?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { action } = body; // 'cancel' or 'reactivate'

    const now = new Date();
    
    if (action === 'reactivate') {
      // Reactivate subscription by removing cancelAtPeriodEnd flag
      const updated = await prisma.subscription.updateMany({
        where: { 
          userId: user.id, 
          status: "ACTIVE", 
          currentPeriodEnd: { gt: now },
          cancelAtPeriodEnd: true
        },
        data: { cancelAtPeriodEnd: false },
      });
      return NextResponse.json({ ok: true, updated: updated.count, action: 'reactivated' });
    } else {
      // Cancel subscription (default behavior)
      const updated = await prisma.subscription.updateMany({
        where: { userId: user.id, status: "ACTIVE", currentPeriodEnd: { gt: now } },
        data: { cancelAtPeriodEnd: true },
      });
      return NextResponse.json({ ok: true, updated: updated.count, action: 'canceled' });
    }
  } catch (error) {
    // If no body provided, use default cancel behavior for backward compatibility
    const now = new Date();
    const updated = await prisma.subscription.updateMany({
      where: { userId: user.id, status: "ACTIVE", currentPeriodEnd: { gt: now } },
      data: { cancelAtPeriodEnd: true },
    });
    return NextResponse.json({ ok: true, updated: updated.count, action: 'canceled' });
  }
}


