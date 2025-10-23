import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      // Update user subscription in database
      console.log(`User ${session.user?.id || session.user?.email} subscribed to ${planId} plan (${billingPeriod}) via PayPal`);
      
      // Here you would typically:
      // 1. Update user subscription in your database
      // 2. Send confirmation email
      // 3. Log the transaction
      
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
  const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
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
