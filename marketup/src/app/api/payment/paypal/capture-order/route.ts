import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderID, planId, billingPeriod } = await request.json();

    // Validate required fields
    if (!orderID || !planId || !billingPeriod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Capture PayPal order
    const paypalResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getPayPalAccessToken()}`,
        },
      }
    );

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json();
      // PayPal order capture failed - handled silently
      return NextResponse.json(
        { error: "Failed to capture PayPal order" },
        { status: 500 }
      );
    }

    const captureData = await paypalResponse.json();

    if (captureData.status === 'COMPLETED') {
      // Get user from session
      const user = await prisma.user.findUnique({
        where: { 
          email: (session as any).user?.email || undefined,
          id: (session as any).user?.id || undefined,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Map planId to tier (pro -> STANDARD)
      const tierMap: Record<string, "BASIC" | "STANDARD" | "PREMIUM"> = {
        'pro': 'STANDARD',
        'premium': 'PREMIUM',
        'free': 'BASIC',
      };

      const tier = tierMap[planId] || 'STANDARD';

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

      console.log(`User ${user.email} subscribed to ${planId} plan (${billingPeriod}) via PayPal`);
      
      return NextResponse.json({
        success: true,
        transactionId: captureData.id,
        status: captureData.status,
      });
    } else {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

  } catch (error) {
    // PayPal order capture error - handled silently
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const baseUrl = process.env.PAYPAL_BASE_URL || 'https://api.sandbox.paypal.com';
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}
