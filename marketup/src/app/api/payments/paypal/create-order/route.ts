import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import paypal from "@paypal/checkout-server-sdk";

function client() {
  // Check if PayPal credentials are configured
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured");
  }

  const env = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
  
  return new paypal.core.PayPalHttpClient(env);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, amount } = body;

    if (!planId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: planId and amount are required" },
        { status: 400 }
      );
    }

    // Validate amount
    const amountValue = parseFloat(amount.toString());
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > 10000) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check PayPal configuration
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { 
          error: "PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.",
          details: process.env.NODE_ENV === 'development' 
            ? "Get your PayPal credentials from https://developer.paypal.com/dashboard/applications/sandbox"
            : undefined
        },
        { status: 500 }
      );
    }

    // Get base URL for return URLs
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create PayPal order
    const orderRequest = new paypal.orders.OrdersCreateRequest();
    orderRequest.prefer("return=representation");
    orderRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amountValue.toFixed(2),
          },
          description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan - Monthly Subscription`,
        },
      ],
      application_context: {
        brand_name: "MarketUp",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${baseUrl}/checkout?success=true&payment_method=paypal&plan=${planId}`,
        cancel_url: `${baseUrl}/checkout?canceled=true&payment_method=paypal`,
      },
    });

    const order = await client().execute(orderRequest);

    // Store order info in database for tracking (optional)
    // You can create a PaymentIntent or similar record here

    return NextResponse.json({
      success: true,
      orderId: order.result.id,
      approvalUrl: order.result.links?.find((link: any) => link.rel === "approve")?.href,
    });

  } catch (error: any) {
    console.error("PayPal create order error:", error);
    
    if (error.message?.includes("PayPal credentials not configured")) {
      return NextResponse.json(
        { 
          error: "PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.",
          details: process.env.NODE_ENV === 'development' 
            ? "Get your PayPal credentials from https://developer.paypal.com/dashboard/applications/sandbox"
            : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}

