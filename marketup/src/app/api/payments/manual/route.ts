import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!(session as any)?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await request.formData();
  const amount = Number(form.get("amount"));
  const currency = String(form.get("currency") || "USD");
  const note = String(form.get("note") || "");
  const receiptUrl = String(form.get("receiptUrl") || "");
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const created = await prisma.manualPayment.create({ data: { userId: user.id, amountCents: Math.round(amount * 100), currency, note, receiptUrl } });
  return NextResponse.json({ ok: true, id: created.id });
}

// Admin confirmation endpoint could be in a protected admin route; placeholder here
export async function PATCH(request: Request) {
  const { id, approve } = await request.json();
  await prisma.manualPayment.update({ where: { id }, data: { status: approve ? "APPROVED" : "REJECTED" } });
  return NextResponse.json({ ok: true });
}


