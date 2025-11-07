import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

const isVercel = process.env.VERCEL === "1";

async function saveReceiptFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `receipts/receipt_${timestamp}.${extension}`;

  if (isVercel) {
    // Use Vercel Blob Storage
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
    });
    return blob.url;
  } else {
    // Local: save to public directory
    const receiptsDir = path.join(process.cwd(), 'public', 'receipts');
    await fs.mkdir(receiptsDir, { recursive: true });
    const filePath = path.join(receiptsDir, `receipt_${timestamp}.${extension}`);
    await fs.writeFile(filePath, buffer);
    return `/receipts/receipt_${timestamp}.${extension}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const amount = Number(form.get("amount"));
    const planId = String(form.get("planId") || "");
    const paymentMethod = String(form.get("paymentMethod") || "");
    const currency = String(form.get("currency") || "USD");
    const note = String(form.get("note") || "");
    const ibanNumber = String(form.get("ibanNumber") || "");
    const receiptFile = form.get("receipt") as File | null;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!receiptFile) {
      return NextResponse.json({ error: "Receipt file is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: (session as any).user.email } 
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save receipt file
    const receiptUrl = await saveReceiptFile(receiptFile);

    // Create manual payment record
    const paymentNote = [
      `Payment method: ${paymentMethod}`,
      planId ? `Plan: ${planId}` : null,
      ibanNumber ? `IBAN: ${ibanNumber}` : null,
      note || null
    ].filter(Boolean).join('\n');

    const created = await prisma.manualPayment.create({ 
      data: { 
        userId: user.id, 
        amountCents: Math.round(amount * 100), 
        currency, 
        note: paymentNote,
        receiptUrl 
      } 
    });

    return NextResponse.json({ 
      success: true, 
      id: created.id,
      message: "Payment submitted successfully. Your subscription will be activated after manual approval."
    });
  } catch (error: any) {
    console.error("Manual payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit payment" },
      { status: 500 }
    );
  }
}

// Admin confirmation endpoint could be in a protected admin route; placeholder here
export async function PATCH(request: Request) {
  const { id, approve } = await request.json();
  await prisma.manualPayment.update({ where: { id }, data: { status: approve ? "APPROVED" : "REJECTED" } });
  return NextResponse.json({ ok: true });
}


