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
      background: #0b0b0b;
      color: #ffffff;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .invoice-container {
      max-width: 900px;
      margin: 0 auto;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .invoice-container::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .invoice-container::after {
      content: '';
      position: absolute;
      bottom: -50%;
      left: -50%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.6);
      position: relative;
      z-index: 1;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
    }
    .logo-icon svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    .logo-text {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .logo-subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin-top: 4px;
    }
    .invoice-info {
      text-align: right;
      position: relative;
      z-index: 1;
    }
    .invoice-info h1 {
      font-size: 36px;
      margin-bottom: 12px;
      color: #ffffff;
      font-weight: 700;
    }
    .invoice-info p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin-bottom: 4px;
    }
    .details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 40px;
      position: relative;
      z-index: 1;
    }
    .detail-section {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 16px;
      padding: 24px;
    }
    .detail-section h3 {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .detail-section p {
      color: #ffffff;
      font-size: 15px;
      margin-bottom: 8px;
    }
    .detail-section strong {
      color: #ffffff;
      font-weight: 600;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }
    .items-table thead {
      background: rgba(30, 41, 59, 0.4);
      border-bottom: 1px solid rgba(51, 65, 85, 0.6);
    }
    .items-table th {
      padding: 16px 20px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
    }
    .items-table td {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.6);
      color: #ffffff;
    }
    .items-table tbody tr:hover {
      background: rgba(30, 41, 59, 0.3);
    }
    .total-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
      position: relative;
      z-index: 1;
    }
    .total-box {
      width: 320px;
      padding: 28px;
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 16px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
    }
    .total-row.total {
      font-size: 28px;
      font-weight: 700;
      padding-top: 20px;
      border-top: 2px solid rgba(51, 65, 85, 0.6);
      margin-top: 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .footer {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid rgba(51, 65, 85, 0.6);
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 12px;
    }
    .status-badge::before {
      content: '';
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
    }
    @media print {
      body {
        background: white;
        color: black;
      }
      .invoice-container {
        background: white;
        border: 1px solid #e5e7eb;
        box-shadow: none;
      }
      .invoice-container::before,
      .invoice-container::after {
        display: none;
      }
      .detail-section {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
      }
      .items-table thead {
        background: #f9fafb;
      }
      .total-box {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
      }
      .status-badge {
        background: #10b981;
        color: white;
        border: none;
      }
      .status-badge::before {
        background: white;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </div>
        <div>
          <div class="logo-text">MarketUp</div>
          <div class="logo-subtitle">AI Video Generation Platform</div>
        </div>
      </div>
      <div class="invoice-info">
        <h1>INVOICE</h1>
        <p>Invoice #${invoiceNumber}</p>
        <p>Date: ${invoiceDate}</p>
        <span class="status-badge">Paid</span>
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
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Billing period: ${invoiceDate}</span>
          </td>
          <td style="text-align: right; font-size: 20px; font-weight: 600;">$${amount.toFixed(2)}</td>
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

