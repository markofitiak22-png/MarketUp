import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Client, CheckoutAPI, EnvironmentEnum } from "@adyen/api-library";

// Initialize Adyen client
function getAdyenClient() {
  const apiKey = process.env.ADYEN_API_KEY;
  const merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT;
  const environment = process.env.NODE_ENV === 'production' 
    ? EnvironmentEnum.LIVE 
    : EnvironmentEnum.TEST;

  if (!apiKey || !merchantAccount) {
    throw new Error("Adyen credentials not configured");
  }

  const client = new Client({
    apiKey: apiKey,
    environment: environment,
  });

  return new CheckoutAPI(client);
}

export async function POST(request: NextRequest) {
  try {
    // Check Adyen configuration
    if (!process.env.ADYEN_API_KEY || !process.env.ADYEN_MERCHANT_ACCOUNT) {
      return NextResponse.json(
        { 
          error: "Adyen is not configured. Please set ADYEN_API_KEY and ADYEN_MERCHANT_ACCOUNT in your .env file.",
          details: process.env.NODE_ENV === 'development' 
            ? "Get your Adyen credentials from https://ca-test.adyen.com/ca/ca/accounts/show.shtml"
            : undefined
        },
        { status: 500 }
      );
    }

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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Map planId to tier80-=-09ш8гн7е6кячс м.Є

	Єдлорт амсвчя
    const tierMap: Record<string, "BASIC" | "STANDARD" | "PREMIUM"> = {
      'pro': 'STANDARD',
      'premium': 'PREMIUM',
      'free': 'BASIC',
    };

    const tier = tierMap[planId] || 'STANDARD';

    // Validate amount
    const amountValue = parseFloat(amount.toString());
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > 10000) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Get base URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create Adyen payment for Swish (redirect-based payment)
    const checkout = getAdyenClient();
    
    const paymentRequest = {
      amount: {
        currency: "SEK", // Swish requires SEK currency
        value: Math.round(amountValue * 100), // Convert to minor units (cents/öre)
      },
      reference: `marketup-${planId}-${user.id}-${Date.now()}`,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
      returnUrl: `${baseUrl}/checkout?success=true&paymentMethod=swish`,
      paymentMethod: {
        type: "swish" as const,
      } as any, // Type assertion needed as Adyen SDK types may not include all payment methods
      // Store metadata in additionalData for webhook processing
      additionalData: {
        metadata: JSON.stringify({
          userId: user.id,
          planId: planId,
          tier: tier,
          paymentMethod: 'swish',
        }),
      },
      shopperReference: user.id,
      shopperEmail: user.email || undefined,
      shopperName: user.name ? {
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
      } : undefined,
    } as any; // Type assertion to bypass strict TypeScript checking for payment method types

    // Use payments endpoint for Swish (redirect-based payment)
    const paymentResponse = await checkout.PaymentsApi.payments(paymentRequest);

    if (!paymentResponse) {
      throw new Error("Failed to create Adyen payment");
    }

    // Swish returns a redirect action
    if (paymentResponse.action?.type === "redirect" && paymentResponse.action.url) {
      return NextResponse.json({
        sessionId: paymentResponse.pspReference,
        url: paymentResponse.action.url,
        paymentData: (paymentResponse.action as any).paymentData, // Type assertion for paymentData property
      });
    }

    // If payment is already completed (shouldn't happen for Swish)
    if (paymentResponse.resultCode === "Authorised") {
      return NextResponse.json({
        sessionId: paymentResponse.pspReference,
        url: `${baseUrl}/checkout?success=true&paymentMethod=swish`,
        completed: true,
      });
    }

    throw new Error("Unexpected payment response from Adyen");

  } catch (error: any) {
    console.error("Adyen Swish payment creation error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || "Failed to create Adyen payment session"
      : "Failed to create payment session. Please try again later.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

