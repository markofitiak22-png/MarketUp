import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return NextResponse.json({ name: user?.name || null, locale: user?.locale || null, country: user?.country || null, email: user?.email });
}

const updateSchema = z.object({ name: z.string().min(1).max(100).optional(), locale: z.string().min(2).max(5).optional(), country: z.string().min(2).max(56).optional() });
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const updated = await prisma.user.update({ where: { email: session.user.email }, data: parsed.data });
  return NextResponse.json({ ok: true, name: updated.name, locale: updated.locale, country: updated.country });
}


