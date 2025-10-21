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

    // Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    // Reuse NextAuth VerificationToken table
    await prisma.verificationToken.create({
      data: { identifier: email, token: code, expires },
    });

    try {
      await sendPasswordResetEmail(email, code);
    } catch (error) {
      console.error('Email sending failed:', error);
      // In development, still return success but don&apos;t show code
      if (process.env.NODE_ENV === 'development') {
        console.log('Dev code (not shown to user):', code);
      }
      // fall back to dev mode behavior if mail fails
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


