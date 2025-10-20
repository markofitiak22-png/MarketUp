import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ name: z.string().optional(), email: z.string().email(), message: z.string().min(5) });

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const { name, email, message } = parsed.data;
  await prisma.contactMessage.create({ data: { name, email, message } });
  return NextResponse.json({ ok: true });
}


