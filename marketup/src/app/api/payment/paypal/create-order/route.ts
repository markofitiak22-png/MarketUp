import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, billingPeriod, amount } = await request.json();

    // Validate required fields
    if (!planId || !billingPeriod || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create PayPal order
    const paypalResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: (amount / 100).toFixed(2), // Convert from cents
            },
            description: `Subscription to ${planId} plan (${billingPeriod})`,
            custom_id: `${session.user?.id || session.user?.email}_${planId}_${billingPeriod}`,
          },
        ],
        application_context: {
          brand_name: 'MarketUp',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
        },
      }),
    });

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json();
      // PayPal order creation failed - handled silently
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    const orderData = await paypalResponse.json();

    return NextResponse.json({
      orderId: orderData.id,
      approvalUrl: orderData.links.find((link: any) => link.rel === 'approve')?.href,
    });

  } catch (error) {
    // PayPal order creation error - handled silently
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
