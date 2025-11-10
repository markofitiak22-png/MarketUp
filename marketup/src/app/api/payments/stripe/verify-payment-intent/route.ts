import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-09-30.clover",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Missing paymentIntentId" },
        { status: 400 }
      );
    }

    // Retrieve Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return NextResponse.json(
        { error: "Payment Intent not found" },
        { status: 404 }
      );
    }

    // Get user
    const userEmail = (session as any).user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if payment succeeded
    if (paymentIntent.status !== "succeeded" && paymentIntent.status !== "requires_capture") {
      return NextResponse.json(
        { 
          success: false,
          error: `Payment status: ${paymentIntent.status}` 
        },
        { status: 400 }
      );
    }

    // Extract metadata
    const { planId, tier, paymentMethod } = paymentIntent.metadata;

    if (!planId || !tier) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing plan information in payment metadata" 
        },
        { status: 400 }
      );
    }

    // Create payment record if it doesn't exist
    const existingPayment = await prisma.manualPayment.findFirst({
      where: {
        userId: user.id,
        note: { contains: paymentIntentId }
      }
    });

    if (!existingPayment) {
      await prisma.manualPayment.create({
        data: {
          userId: user.id,
          amountCents: paymentIntent.amount,
          currency: paymentIntent.currency?.toUpperCase() || 'USD',
          status: 'APPROVED',
          note: `Stripe payment - ${paymentMethod || 'wallet'}\nPlan: ${planId || 'pro'}\nPayment Intent ID: ${paymentIntentId}`,
        },
      });
    }

    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
    });

    if (existingSubscription) {
      // Update existing subscription
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          tier: tier as "BASIC" | "STANDARD" | "PREMIUM",
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      return NextResponse.json({
        success: true,
        subscription: existingSubscription,
        message: "Subscription updated",
      });
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: tier as "BASIC" | "STANDARD" | "PREMIUM",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return NextResponse.json({
      success: true,
      subscription: subscription,
      message: "Subscription created",
    });

  } catch (error: any) {
    console.error("Payment Intent verification error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to verify payment intent" 
      },
      { status: 500 }
    );
  }
}

