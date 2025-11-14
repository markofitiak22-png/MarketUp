import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-09-30.clover",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get base URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create or retrieve Stripe customer
    let customerId: string;
    try {
      const existingCustomers = await stripe.customers.list({
        email: user.email || '',
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email || '',
          name: user.name || undefined,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;
      }
    } catch (error) {
      console.error("Customer creation error:", error);
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 }
      );
    }

    // Get action from request body (add or update)
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'add_payment_method';

    // Create Checkout Session in setup mode to save/update payment method
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'setup',
      customer: customerId,
      payment_method_types: ['card'],
      success_url: `${baseUrl}/dashboard/billing?payment_method_${action === 'update_payment_method' ? 'updated' : 'added'}=true`,
      cancel_url: `${baseUrl}/dashboard/billing?payment_method_canceled=true`,
      metadata: {
        userId: user.id,
        action: action,
      },
    });

    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
    });

  } catch (error: any) {
    console.error("Setup payment method error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create setup session" },
      { status: 500 }
    );
  }
}

