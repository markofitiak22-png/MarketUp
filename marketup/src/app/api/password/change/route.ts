import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { compare, hash } from "bcrypt";

const schema = z.object({ currentPassword: z.string().min(6), newPassword: z.string().min(6) });

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

    const { currentPassword, newPassword } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user?.passwordHash) return NextResponse.json({ error: "no_password_set" }, { status: 400 });

    const ok = await compare(currentPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "wrong_password" }, { status: 400 });

    const passwordHash = await hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


