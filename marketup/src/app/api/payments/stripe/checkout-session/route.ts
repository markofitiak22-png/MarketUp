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
      console.error("STRIPE_SECRET_KEY is not configured or is a placeholder");
      return NextResponse.json(
        { 
          error: "Payment system not configured. Please set a valid STRIPE_SECRET_KEY in your .env file.",
          details: process.env.NODE_ENV === 'development' 
            ? "Get your Stripe API key from https://dashboard.stripe.com/apikeys"
            : undefined
        },
        { status: 500 }
      );
    }

    // Validate key format
    if (!stripeKey.startsWith('sk_test_') && !stripeKey.startsWith('sk_live_')) {
      console.error("STRIPE_SECRET_KEY has invalid format");
      return NextResponse.json(
        { 
          error: "Invalid Stripe API key format. Key must start with 'sk_test_' or 'sk_live_'",
          details: process.env.NODE_ENV === 'development' 
            ? "Get your Stripe API key from https://dashboard.stripe.com/apikeys"
            : undefined
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

    // Determine payment method types based on selected method
    let paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card'];
    let paymentMethodOptions: Stripe.Checkout.SessionCreateParams.PaymentMethodOptions = {
      card: {
        request_three_d_secure: 'automatic',
      },
    };
    
    if (paymentMethod === 'apple_pay') {
      paymentMethodTypes = ['card']; // Apple Pay is handled through card payment
    } else if (paymentMethod === 'klarna') {
      paymentMethodTypes = ['klarna'];
      // Klarna doesn't need additional options in Checkout Sessions
      // Stripe will automatically handle Klarna configuration
      paymentMethodOptions = {};
    } else if (paymentMethod === 'swish') {
      // Swish is Sweden-specific, will be handled separately if needed
      paymentMethodTypes = ['card'];
    }

    // Create Stripe Checkout Session (one-time payment for monthly subscription)
    const checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      customer_email: user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
              description: `Monthly subscription to ${planId} plan`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
        tier: tier,
        paymentMethod: paymentMethod || 'stripe_card',
      },
      payment_method_types: paymentMethodTypes,
    };

    // Only add payment_method_options if not empty (for Klarna we don't need it)
    if (Object.keys(paymentMethodOptions).length > 0) {
      checkoutSessionParams.payment_method_options = paymentMethodOptions;
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutSessionParams);

    if (!checkoutSession.url) {
      throw new Error("Stripe checkout session created but no URL returned");
    }

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error: any) {
    console.error("Stripe checkout session creation error:", error);
    console.error("Error details:", {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
    });
    
    // Handle specific Stripe authentication errors
    if (error.type === 'StripeAuthenticationError' || error.message?.includes('Invalid API Key')) {
      return NextResponse.json(
        { 
          error: "Invalid Stripe API key. Please check your STRIPE_SECRET_KEY in .env file.",
          details: process.env.NODE_ENV === 'development' 
            ? "Get your Stripe API key from https://dashboard.stripe.com/apikeys. Make sure it starts with 'sk_test_' for testing."
            : undefined
        },
        { status: 500 }
      );
    }
    
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || "Failed to create checkout session"
      : "Failed to create checkout session. Please try again later.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

