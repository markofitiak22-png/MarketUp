import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";

const schema = z.object({ code: z.string().length(6), password: z.string().min(6) });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    const { code, password } = parsed.data;

    const vt = await prisma.verificationToken.findUnique({ where: { token: code } });
    if (!vt || vt.expires < new Date()) return NextResponse.json({ error: "invalid_code" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: vt.identifier } });
    if (!user) return NextResponse.json({ error: "invalid_code" }, { status: 400 });

    const passwordHash = await hash(password, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    await prisma.verificationToken.delete({ where: { token: code } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


