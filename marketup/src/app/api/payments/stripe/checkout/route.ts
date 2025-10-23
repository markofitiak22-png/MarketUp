import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", { apiVersion: "2025-09-30.clover" });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { tier } = await request.json();

  const priceMap: Record<string, string> = {
    BASIC: process.env.STRIPE_PRICE_BASIC || "",
    STANDARD: process.env.STRIPE_PRICE_STANDARD || "",
    PREMIUM: process.env.STRIPE_PRICE_PREMIUM || "",
  };

  const price = priceMap[tier];
  if (!price) return NextResponse.json({ error: "invalid_tier" }, { status: 400 });

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    payment_method_types: ["card", "klarna"],
    success_url: `${process.env.NEXTAUTH_URL}/pricing?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=1`,
    metadata: { tier },
  });

  return NextResponse.json({ url: checkout.url });
}


