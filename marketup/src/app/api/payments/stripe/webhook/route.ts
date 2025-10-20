import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const config = { api: { bodyParser: false } } as const;

async function buffer(req: Request) {
  const arrayBuffer = await req.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
  const sig = (req.headers.get("stripe-signature") || "").toString();
  const buf = await buffer(req);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "invoice.payment_succeeded") {
    const session = event.data.object as any;
    const customerEmail: string | undefined = session.customer_email || session.customer_details?.email;
    const tier: string | undefined = session.metadata?.tier;
    if (customerEmail && tier) {
      const user = await prisma.user.findUnique({ where: { email: customerEmail } });
      if (user) {
        const now = new Date();
        const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
        await prisma.subscription.updateMany({ where: { userId: user.id, status: "ACTIVE" }, data: { status: "CANCELED", cancelAtPeriodEnd: true } });
        await prisma.subscription.create({
          data: {
            userId: user.id,
            tier: tier as any,
            status: "ACTIVE",
            currentPeriodStart: now,
            currentPeriodEnd: end,
          },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}


