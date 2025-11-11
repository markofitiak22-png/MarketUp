import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const isConfigured = !!(
      process.env.ADYEN_API_KEY &&
      process.env.ADYEN_MERCHANT_ACCOUNT &&
      process.env.ADYEN_API_KEY !== "" &&
      process.env.ADYEN_MERCHANT_ACCOUNT !== "" &&
      !process.env.ADYEN_API_KEY.includes("placeholder") &&
      !process.env.ADYEN_MERCHANT_ACCOUNT.includes("placeholder")
    );

    return NextResponse.json({
      configured: isConfigured,
    });
  } catch (error: any) {
    return NextResponse.json(
      { configured: false, error: error.message },
      { status: 500 }
    );
  }
}

