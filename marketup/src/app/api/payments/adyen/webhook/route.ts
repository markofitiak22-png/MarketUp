import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Adyen webhook signature verification
// Adyen sends signatures in format: key1=value1,key2=value2
function verifyWebhookSignature(
  payload: string,
  signatureHeader: string,
  hmacKey: string
): boolean {
  try {
    const crypto = require('crypto');
    
    // Parse signature header (format: key1=value1,key2=value2)
    const signatures = signatureHeader.split(',').reduce((acc: Record<string, string>, pair: string) => {
      const [key, value] = pair.split('=');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});

    // Calculate expected signature
    const calculatedSignature = crypto
      .createHmac('sha256', hmacKey)
      .update(payload)
      .digest('base64');

    // Verify against all signatures in header
    for (const sigValue of Object.values(signatures)) {
      try {
        if (crypto.timingSafeEqual(
          Buffer.from(sigValue),
          Buffer.from(calculatedSignature)
        )) {
          return true;
        }
      } catch (e) {
        // Continue checking other signatures
      }
    }

    return false;
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Adyen webhook received");
    
    const webhookSecret = process.env.ADYEN_HMAC_KEY;
    if (!webhookSecret) {
      console.error("❌ ADYEN_HMAC_KEY is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headersList = await request.headers;
    const signature = headersList.get("adyen-signature");

    if (!signature) {
      console.error("❌ No signature in webhook request");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    console.log("✅ Signature found, verifying...");

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.error("❌ Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("✅ Webhook signature verified");

    const notification = JSON.parse(body);
    
    // Adyen sends notifications in a specific format
    const notificationItems = notification.notificationItems || [];
    
    for (const item of notificationItems) {
      const notificationItem = item.NotificationRequestItem;
      
      if (!notificationItem) continue;

      const eventCode = notificationItem.eventCode;
      const success = notificationItem.success === "true";
      const pspReference = notificationItem.pspReference;
      const merchantReference = notificationItem.merchantReference;
      const amount = notificationItem.amount;
      
      // Parse metadata from additionalData
      let metadata = {};
      if (notificationItem.additionalData?.metadata) {
        try {
          metadata = typeof notificationItem.additionalData.metadata === 'string'
            ? JSON.parse(notificationItem.additionalData.metadata)
            : notificationItem.additionalData.metadata;
        } catch (e) {
          console.error("Failed to parse metadata:", e);
        }
      }

      console.log("📦 Processing notification:", {
        eventCode,
        success,
        pspReference,
        merchantReference,
      });

      // Handle successful payment
      if (eventCode === "AUTHORISATION" && success) {
        await handlePaymentSuccess({
          pspReference,
          merchantReference,
          amount,
          metadata,
        });
      } else if (eventCode === "AUTHORISATION" && !success) {
        await handlePaymentFailure({
          pspReference,
          merchantReference,
          metadata,
        });
      }
    }

    // Adyen expects [accepted] response
    return NextResponse.json("[accepted]");

  } catch (error: any) {
    console.error("❌ Adyen webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess({
  pspReference,
  merchantReference,
  amount,
  metadata,
}: {
  pspReference: string;
  merchantReference: string;
  amount: any;
  metadata: any;
}) {
  try {
    console.log("✅ Payment succeeded:", pspReference);
    
    const { userId, planId, tier } = metadata;
    
    if (!userId || !tier) {
      console.error("❌ Missing metadata in payment:", { userId, tier, metadata });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("❌ User not found:", userId);
      return;
    }

    console.log("✅ User found:", user.email);

    // Get payment amount
    const amountValue = amount?.value ? parseInt(amount.value) : 0;
    const currency = amount?.currency || 'SEK';

    console.log("💰 Payment amount:", amountValue / 100, currency);

    // Create payment record for admin panel
    const paymentRecord = await prisma.manualPayment.create({
      data: {
        userId: user.id,
        amountCents: amountValue,
        currency: currency,
        status: 'APPROVED',
        note: `Adyen Swish payment\nPlan: ${planId || 'pro'}\nPSP Reference: ${pspReference}\nMerchant Reference: ${merchantReference}`,
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
    console.log(`✅ User ${user.email} subscribed to ${planId} plan via Adyen Swish`);
  } catch (error) {
    console.error("❌ Error handling payment success:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
}

async function handlePaymentFailure({
  pspReference,
  merchantReference,
  metadata,
}: {
  pspReference: string;
  merchantReference: string;
  metadata: any;
}) {
  console.log("❌ Payment failed:", pspReference);
  
  const { userId } = metadata;
  
  if (userId) {
    // Optionally notify user of payment failure
    console.log(`Payment failed for user ${userId}`);
  }
}

