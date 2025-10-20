import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "node:crypto";
import { sendPasswordResetEmail } from "@/lib/mailer";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond OK to avoid user enumeration
    if (!user) return NextResponse.json({ ok: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Reuse NextAuth VerificationToken table
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    try {
      await sendPasswordResetEmail(email, token);
    } catch {
      // fall back to dev mode behavior if mail fails
      return NextResponse.json({ ok: true, devToken: token });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


