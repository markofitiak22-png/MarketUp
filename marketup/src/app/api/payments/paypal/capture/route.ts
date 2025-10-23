import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";

function client() {
  const env = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID || "",
    process.env.PAYPAL_CLIENT_SECRET || ""
  );
  return new paypal.core.PayPalHttpClient(env);
}

export async function POST(request: Request) {
  const { orderId } = await request.json();
  const req = new paypal.orders.OrdersCaptureRequest(orderId);
  req.requestBody({ payment_source: { token: { id: orderId, type: "BILLING_AGREEMENT" } } });
  const res = await client().execute(req);
  return NextResponse.json({ ok: true, result: res.result });
}


