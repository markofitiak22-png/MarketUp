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
  const { amount = "19.00", currency = "USD" } = await request.json();
  const req = new paypal.orders.OrdersCreateRequest();
  req.prefer("return=representation");
  req.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: currency, value: amount } }],
  });
  const response = await client().execute(req);
  return NextResponse.json({ id: response.result.id });
}


