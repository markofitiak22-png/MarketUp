import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-09-30.clover",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, billingPeriod, amount, billingInfo } = await request.json();

    // Validate required fields
    if (!planId || !billingPeriod || !amount || !billingInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create or retrieve customer
    let customer;
    try {
      const existingCustomers = await stripe.customers.list({
        email: billingInfo.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: billingInfo.email,
          name: `${billingInfo.firstName} ${billingInfo.lastName}`,
          address: {
            line1: billingInfo.address,
            city: billingInfo.city,
            state: billingInfo.state,
            postal_code: billingInfo.zipCode,
            country: billingInfo.country,
          },
          metadata: {
            userId: session.user?.id || session.user?.email || '',
            planId,
            billingPeriod,
          },
        });
      }
    } catch (error) {
      console.error("Customer creation error:", error);
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      metadata: {
        planId,
        billingPeriod,
        userId: session.user?.id || session.user?.email || '',
      },
      description: `Subscription to ${planId} plan (${billingPeriod})`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
    });

  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
