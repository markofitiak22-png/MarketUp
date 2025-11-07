import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const invoiceId = resolvedParams.id;

    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        manualPayments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Find payment by invoice ID or use the most recent payment
    const payment = user.manualPayments.find(p => 
      p.id.includes(invoiceId) || 
      p.note?.includes(invoiceId)
    ) || user.manualPayments[0];

    if (!payment) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const subscription = user.subscriptions[0];
    const planName = subscription?.tier === 'STANDARD' ? 'Pro Plan' :
                     subscription?.tier === 'PREMIUM' ? 'Premium Plan' : 'Free Plan';
    const amount = payment.amountCents / 100;
    const invoiceDate = payment.createdAt.toISOString().split('T')[0];
    const invoiceNumber = `INV-${payment.createdAt.getFullYear()}-${payment.id.slice(-6).toUpperCase()}`;

    // Generate HTML invoice
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #0a0a0a;
      color: #e6e7ea;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #121316;
      border: 1px solid #2a2b2e;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #2a2b2e;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info h1 {
      font-size: 32px;
      margin-bottom: 10px;
      color: #e6e7ea;
    }
    .invoice-info p {
      color: #a1a1aa;
      font-size: 14px;
    }
    .details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .detail-section h3 {
      font-size: 14px;
      color: #a1a1aa;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .detail-section p {
      color: #e6e7ea;
      font-size: 16px;
      margin-bottom: 8px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table thead {
      background: #1a1b1e;
      border-bottom: 2px solid #2a2b2e;
    }
    .items-table th {
      padding: 16px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #a1a1aa;
      font-weight: 600;
    }
    .items-table td {
      padding: 20px 16px;
      border-bottom: 1px solid #2a2b2e;
      color: #e6e7ea;
    }
    .items-table tbody tr:hover {
      background: #1a1b1e;
    }
    .total-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    .total-box {
      width: 300px;
      padding: 24px;
      background: #1a1b1e;
      border: 1px solid #2a2b2e;
      border-radius: 12px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 16px;
    }
    .total-row.total {
      font-size: 24px;
      font-weight: bold;
      padding-top: 16px;
      border-top: 2px solid #2a2b2e;
      margin-top: 16px;
      color: #6366f1;
    }
    .footer {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #2a2b2e;
      text-align: center;
      color: #a1a1aa;
      font-size: 14px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #10b981;
      color: white;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    @media print {
      body {
        background: white;
        color: black;
      }
      .invoice-container {
        background: white;
        border: none;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div>
        <div class="logo">MarketUp</div>
        <p style="color: #a1a1aa; margin-top: 8px;">AI Video Generation Platform</p>
      </div>
      <div class="invoice-info">
        <h1>INVOICE</h1>
        <p>Invoice #${invoiceNumber}</p>
        <p>Date: ${invoiceDate}</p>
        <p style="margin-top: 12px;">
          <span class="status-badge">Paid</span>
        </p>
      </div>
    </div>

    <div class="details">
      <div class="detail-section">
        <h3>Bill To</h3>
        <p><strong>${user.name || 'Customer'}</strong></p>
        <p>${user.email}</p>
      </div>
      <div class="detail-section">
        <h3>Payment Details</h3>
        <p><strong>Payment Method:</strong> ${payment.note?.includes('Stripe') ? 'Stripe' : payment.note?.includes('PayPal') ? 'PayPal' : 'Bank Transfer'}</p>
        <p><strong>Currency:</strong> ${payment.currency}</p>
        <p><strong>Transaction ID:</strong> ${payment.id.slice(-8).toUpperCase()}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${planName} - Monthly Subscription</strong><br>
            <span style="color: #a1a1aa; font-size: 14px;">Billing period: ${invoiceDate}</span>
          </td>
          <td style="text-align: right; font-size: 18px; font-weight: 600;">$${amount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-section">
      <div class="total-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${amount.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>$0.00</span>
        </div>
        <div class="total-row total">
          <span>Total:</span>
          <span>$${amount.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p style="margin-top: 8px;">This is an automated invoice. For questions, please contact support.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Return HTML that can be printed as PDF or saved
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${invoiceNumber}.html"`,
      },
    });

  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}

