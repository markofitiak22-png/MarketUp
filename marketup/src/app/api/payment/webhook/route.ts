import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-09-30.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Webhook received");
    
    // Check webhook secret
    if (!webhookSecret || webhookSecret === "" || webhookSecret.includes("placeholder")) {
      console.error("❌ STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("❌ No signature in webhook request");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    console.log("✅ Signature found, verifying...");

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("✅ Webhook signature verified");
      console.log("📦 Event type:", event.type);
      console.log("📦 Event ID:", event.id);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log("🔄 Processing checkout.session.completed event");
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment succeeded:", paymentIntent.id);
  
  const { planId, billingPeriod, userId } = paymentIntent.metadata;
  
  // Update user subscription in database
  // This would typically involve updating your database
  console.log(`User ${userId} subscribed to ${planId} plan (${billingPeriod})`);
  
  // Send confirmation email
  // await sendSubscriptionConfirmationEmail(userId, planId);
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { prisma } = await import("@/lib/prisma");
  
  try {
    console.log("🔔 Webhook: checkout.session.completed received");
    console.log("Session ID:", session.id);
    console.log("Session metadata:", session.metadata);
    
    const { userId, planId, tier, paymentMethod } = session.metadata || {};
    
    if (!userId || !tier) {
      console.error("❌ Missing metadata in checkout session:", { userId, tier, metadata: session.metadata });
      return;
    }

    console.log("✅ Metadata found:", { userId, planId, tier, paymentMethod });

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("❌ User not found:", userId);
      return;
    }

    console.log("✅ User found:", user.email);

    // Get payment amount from session
    const amountTotal = session.amount_total || 0; // Amount in cents
    const currency = session.currency?.toUpperCase() || 'USD';

    console.log("💰 Payment amount:", amountTotal / 100, currency);

    // Create payment record for admin panel
    const paymentRecord = await prisma.manualPayment.create({
      data: {
        userId: user.id,
        amountCents: amountTotal,
        currency: currency,
        status: 'APPROVED', // Stripe payments are automatically approved
        note: `Stripe payment - ${paymentMethod || 'card'}\nPlan: ${planId || 'pro'}\nSession ID: ${session.id}`,
      },
    });

    console.log("✅ Payment record created:", paymentRecord.id);

    // Cancel existing active subscriptions
    const canceledCount = await prisma.subscription.updateMany({
      where: { 
        userId: user.id, 
        status: "ACTIVE" 
      },
      data: { 
        status: "CANCELED", 
        cancelAtPeriodEnd: true 
      },
    });

    console.log(`✅ Canceled ${canceledCount.count} existing subscriptions`);

    // Create new subscription
    const now = new Date();
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 days

    const newSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: tier as "BASIC" | "STANDARD" | "PREMIUM",
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: end,
      },
    });

    console.log(`✅ Subscription created:`, {
      id: newSubscription.id,
      tier: newSubscription.tier,
      status: newSubscription.status,
      userId: newSubscription.userId
    });
    console.log(`✅ User ${user.email} subscribed to ${planId} plan via Stripe`);

    // Calculate marketer commission if applicable
    try {
      const { calculateMarketerCommission } = await import("@/lib/marketer-commissions");
      const commission = await calculateMarketerCommission(
        user.id,
        tier as "BASIC" | "STANDARD" | "PREMIUM",
        amountTotal
      );
      if (commission) {
        console.log(`💰 Marketer commission calculated:`, commission);
      }
    } catch (error) {
      console.error("Error calculating marketer commission:", error);
    }
  } catch (error) {
    console.error("❌ Error handling checkout session completed:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment failed:", paymentIntent.id);
  
  const { userId } = paymentIntent.metadata;
  
  // Notify user of payment failure
  // await sendPaymentFailureEmail(userId);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("Subscription created:", subscription.id);
  
  // Update database with subscription details
  // await updateUserSubscription(subscription);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id);
  
  // Update database with new subscription details
  // await updateUserSubscription(subscription);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id);
  
  // Update database to mark subscription as cancelled
  // await cancelUserSubscription(subscription.id);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Invoice payment succeeded:", invoice.id);
  
  // Handle successful recurring payment
  // await processRecurringPayment(invoice);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Invoice payment failed:", invoice.id);
  
  // Handle failed recurring payment
  // await handleFailedRecurringPayment(invoice);
}
