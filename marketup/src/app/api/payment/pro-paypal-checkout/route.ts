import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await request.json();

    // Only allow pro plan
    if (planId !== 'pro') {
      return NextResponse.json(
        { error: "Only pro plan is available" },
        { status: 400 }
      );
    }

    // Pro plan price: $42 per month
    const amount = 42.00; // $42

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const paypalResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL || 'https://api.sandbox.paypal.com'}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: amount.toFixed(2),
              },
              description: `MarketUp Pro Plan - Monthly Subscription`,
              custom_id: `${(session as any).user?.id || (session as any).user?.email}_pro_monthly`,
            },
          ],
          application_context: {
            brand_name: 'MarketUp',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?success=true&plan=pro`,
            cancel_url: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?canceled=true&plan=pro`,
          },
        }),
      }
    );

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json();
      console.error('PayPal order creation error:', errorData);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    const orderData = await paypalResponse.json();

    return NextResponse.json({
      orderId: orderData.id,
      approvalUrl: orderData.links?.find((link: any) => link.rel === 'approve')?.href,
    });

  } catch (error: any) {
    console.error("PayPal checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
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

