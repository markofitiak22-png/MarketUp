import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-09-30.clover",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Retrieve Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Check if subscription already exists (webhook might have created it)
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE'
      }
    });

    if (existingSubscription) {
      return NextResponse.json({
        success: true,
        message: "Subscription already exists",
        subscription: {
          tier: existingSubscription.tier,
          status: existingSubscription.status
        }
      });
    }

    // Get metadata from session
    const { userId, planId, tier, paymentMethod } = checkoutSession.metadata || {};

    // Verify user matches
    if (userId && userId !== user.id) {
      return NextResponse.json(
        { error: "Session does not match user" },
        { status: 403 }
      );
    }

    // Map planId to tier if tier is not in metadata
    const tierMap: Record<string, "BASIC" | "STANDARD" | "PREMIUM"> = {
      'pro': 'STANDARD',
      'premium': 'PREMIUM',
      'free': 'BASIC',
    };
    const finalTier = (tier || (planId ? tierMap[planId.toLowerCase()] : 'STANDARD')) as "BASIC" | "STANDARD" | "PREMIUM";

    // Create payment record if it doesn't exist
    const existingPayment = await prisma.manualPayment.findFirst({
      where: {
        userId: user.id,
        note: { contains: checkoutSession.id }
      }
    });

    if (!existingPayment) {
      await prisma.manualPayment.create({
        data: {
          userId: user.id,
          amountCents: checkoutSession.amount_total || 0,
          currency: checkoutSession.currency?.toUpperCase() || 'USD',
          status: 'APPROVED',
          note: `Stripe payment - ${paymentMethod || 'card'}\nPlan: ${planId || 'pro'}\nSession ID: ${checkoutSession.id}`,
        },
      });
    }

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

    const newSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: finalTier,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: end,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription created successfully",
      subscription: {
        tier: newSubscription.tier,
        status: newSubscription.status,
        periodEnd: newSubscription.currentPeriodEnd
      }
    });

  } catch (error: any) {
    console.error("Verify session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}

