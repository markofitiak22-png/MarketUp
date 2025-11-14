import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;

    // Get all user data
    const [user, videos, subscriptions, payments] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          locale: true,
          country: true,
          createdAt: true,
        }
      }),
      prisma.video.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          status: true,
          videoUrl: true,
          createdAt: true,
          completedAt: true,
          settings: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.subscription.findMany({
        where: { userId },
        select: {
          id: true,
          tier: true,
          status: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.manualPayment.findMany({
        where: { userId },
        select: {
          id: true,
          amountCents: true,
          currency: true,
          status: true,
          note: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Helper function to escape HTML
    const escapeHtml = (text: string | null) => {
      if (!text) return 'N/A';
      return String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };

    // Plan name mapping
    const planNameMap: Record<string, string> = {
      'BASIC': 'Free',
      'STANDARD': 'Pro',
      'PREMIUM': 'Premium'
    };

    // Generate HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #4f46e5;
      margin-bottom: 10px;
    }
    .date {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }
    h2 {
      color: #4f46e5;
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 5px;
      margin-top: 30px;
    }
    .summary {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .summary-item {
      margin: 5px 0;
    }
    .user-info {
      background-color: #e8f4f8;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .user-info-item {
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #4f46e5;
      color: white;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    .status-completed { color: #10b981; font-weight: bold; }
    .status-pending { color: #f59e0b; font-weight: bold; }
    .status-processing { color: #3b82f6; font-weight: bold; }
    .status-failed { color: #ef4444; font-weight: bold; }
    .status-active { color: #10b981; font-weight: bold; }
    .status-canceled { color: #ef4444; font-weight: bold; }
    .status-approved { color: #10b981; font-weight: bold; }
    .status-pending-payment { color: #f59e0b; font-weight: bold; }
  </style>
</head>
<body>
  <h1>MarketUp Data Export</h1>
  <div class="date">Generated: ${new Date().toLocaleString()}</div>

  <div class="user-info">
    <h2 style="margin-top: 0; border: none; color: #4f46e5;">Account Information</h2>
    <div class="user-info-item"><strong>Name:</strong> ${escapeHtml(user.name)}</div>
    <div class="user-info-item"><strong>Email:</strong> ${escapeHtml(user.email)}</div>
    <div class="user-info-item"><strong>Locale:</strong> ${escapeHtml(user.locale) || 'N/A'}</div>
    <div class="user-info-item"><strong>Country:</strong> ${escapeHtml(user.country) || 'N/A'}</div>
    <div class="user-info-item"><strong>Member Since:</strong> ${user.createdAt.toLocaleDateString()}</div>
  </div>

  <div class="summary">
    <h2 style="margin-top: 0; border: none; color: #4f46e5;">Summary</h2>
    <div class="summary-item"><strong>Total Videos:</strong> ${videos.length}</div>
    <div class="summary-item"><strong>Completed Videos:</strong> ${videos.filter(v => v.status === 'COMPLETED').length}</div>
    <div class="summary-item"><strong>Pending Videos:</strong> ${videos.filter(v => v.status === 'PENDING').length}</div>
    <div class="summary-item"><strong>Processing Videos:</strong> ${videos.filter(v => v.status === 'PROCESSING').length}</div>
    <div class="summary-item"><strong>Failed Videos:</strong> ${videos.filter(v => v.status === 'FAILED').length}</div>
    <div class="summary-item"><strong>Total Subscriptions:</strong> ${subscriptions.length}</div>
    <div class="summary-item"><strong>Active Subscriptions:</strong> ${subscriptions.filter(s => s.status === 'ACTIVE').length}</div>
    <div class="summary-item"><strong>Total Payments:</strong> ${payments.length}</div>
    <div class="summary-item"><strong>Approved Payments:</strong> ${payments.filter(p => p.status === 'APPROVED').length}</div>
    <div class="summary-item"><strong>Total Amount Paid:</strong> ${(payments.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + p.amountCents, 0) / 100).toFixed(2)} ${payments[0]?.currency || 'USD'}</div>
  </div>

  ${videos.length > 0 ? `
  <h2>Videos</h2>
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Status</th>
        <th>Created</th>
        <th>Completed</th>
      </tr>
    </thead>
    <tbody>
      ${videos.map(video => `
        <tr>
          <td>${escapeHtml(video.title)}</td>
          <td><span class="status-${video.status.toLowerCase()}">${video.status}</span></td>
          <td>${video.createdAt.toLocaleDateString()}</td>
          <td>${video.completedAt ? video.completedAt.toLocaleDateString() : 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : '<p>No videos found.</p>'}

  ${subscriptions.length > 0 ? `
  <h2>Subscriptions</h2>
  <table>
    <thead>
      <tr>
        <th>Plan</th>
        <th>Status</th>
        <th>Period Start</th>
        <th>Period End</th>
        <th>Cancel at Period End</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      ${subscriptions.map(sub => {
        const planName = planNameMap[sub.tier] || sub.tier;
        return `
        <tr>
          <td>${planName}</td>
          <td><span class="status-${sub.status.toLowerCase()}">${sub.status}</span></td>
          <td>${sub.currentPeriodStart.toLocaleDateString()}</td>
          <td>${sub.currentPeriodEnd.toLocaleDateString()}</td>
          <td>${sub.cancelAtPeriodEnd ? 'Yes' : 'No'}</td>
          <td>${sub.createdAt.toLocaleDateString()}</td>
        </tr>
      `;
      }).join('')}
    </tbody>
  </table>
  ` : '<p>No subscriptions found.</p>'}

  ${payments.length > 0 ? `
  <h2>Payments</h2>
  <table>
    <thead>
      <tr>
        <th>Amount</th>
        <th>Currency</th>
        <th>Status</th>
        <th>Note</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      ${payments.map(payment => `
        <tr>
          <td>${(payment.amountCents / 100).toFixed(2)}</td>
          <td>${payment.currency}</td>
          <td><span class="status-${payment.status.toLowerCase().replace('_', '-')}">${payment.status}</span></td>
          <td>${escapeHtml(payment.note) || 'N/A'}</td>
          <td>${payment.createdAt.toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : '<p>No payments found.</p>'}

</body>
</html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true
    });
    
    await browser.close();
    
    // Return PDF file
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="marketup-data-export-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Export data error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

