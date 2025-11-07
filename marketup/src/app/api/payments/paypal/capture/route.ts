import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import paypal from "@paypal/checkout-server-sdk";

function client() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured");
  }

  const env = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
  
  return new paypal.core.PayPalHttpClient(env);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, planId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing required field: orderId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Capture PayPal order
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.prefer("return=representation");
    
    const captureResponse = await client().execute(captureRequest);

    if (captureResponse.result.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment was not completed" },
        { status: 400 }
      );
    }

    // Get payment amount
    const amount = parseFloat(
      captureResponse.result.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || "0"
    );

    // Map planId to tier
    const tierMap: Record<string, "BASIC" | "STANDARD" | "PREMIUM"> = {
      'pro': 'STANDARD',
      'premium': 'PREMIUM',
      'free': 'BASIC',
    };
    const tier = planId ? (tierMap[planId.toLowerCase()] || 'STANDARD') : 'STANDARD';

    // Cancel existing active subscriptions
    await prisma.subscription.updateMany({
      where: { 
        userId: user.id, 
        status: "ACTIVE" 
      },
      data: { 
        status: "CANCELED", 
        cancelAtPeriodEnd: true 
      },
    });

    // Create new subscription
    const now = new Date();
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 days

    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: tier,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: end,
      },
    });

    return NextResponse.json({ 
      success: true, 
      orderId: captureResponse.result.id,
      amount: amount,
      message: "Payment captured and subscription activated"
    });

  } catch (error: any) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to capture PayPal payment" },
      { status: 500 }
    );
  }
}


