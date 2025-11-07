import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// TODO: This is a placeholder. Once Syriatel API documentation is provided,
// implement the actual integration following their API specifications.

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, amount, phoneNumber } = body;

    if (!planId || !amount || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields: planId, amount, and phoneNumber are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // TODO: Implement actual Syriatel Cash API integration
    // For now, create a manual payment record that requires receipt upload
    // Once Syriatel API is integrated, this will be replaced with actual API calls
    
    // Placeholder response
    return NextResponse.json({
      success: true,
      message: "Syriatel Cash payment request created. Please upload your payment receipt.",
      requiresReceipt: true,
      // Once API is integrated, these fields will be populated:
      // transactionId: syriatelTransactionId,
      // otpRequired: true,
      // paymentUrl: syriatelPaymentUrl
    });

  } catch (error: any) {
    console.error("Syriatel payment request error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Syriatel payment request" },
      { status: 500 }
    );
  }
}

