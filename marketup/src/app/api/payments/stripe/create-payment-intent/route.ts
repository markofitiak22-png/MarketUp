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
    // Check Stripe key
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey === "" || stripeKey.includes("placeholder") || stripeKey.includes("your_")) {
      return NextResponse.json(
        { 
          error: "Payment system not configured",
        },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, amount, paymentMethod } = body;

    if (!planId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: planId and amount are required" },
        { status: 400 }
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

    // Map planId to tier
    const tierMap: Record<string, "BASIC" | "STANDARD" | "PREMIUM"> = {
      'pro': 'STANDARD',
      'premium': 'PREMIUM',
      'free': 'BASIC',
    };

    const tier = tierMap[planId] || 'STANDARD';

    // Validate amount
    const amountInCents = Math.round(amount * 100);
    if (amountInCents <= 0 || amountInCents > 1000000) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Get base URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create Payment Intent for wallet payments (Apple Pay, Google Pay, Samsung Pay)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: {
        userId: user.id,
        planId: planId,
        tier: tier,
        paymentMethod: paymentMethod || 'wallet',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    console.error("Payment Intent creation error:", error);
    
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

