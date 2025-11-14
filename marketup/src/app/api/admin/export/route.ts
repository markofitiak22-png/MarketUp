import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all data for export
    const [users, videos, subscriptions, marketers] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          locale: true,
          country: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.video.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          videoUrl: true,
          completedAt: true,
          createdAt: true,
          settings: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.subscription.findMany({
        select: {
          id: true,
          tier: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.marketer.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          baseCommissionPercentage: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Generate HTML content
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
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
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
    .summary {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .summary-item {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <h1>MarketUp Admin Report</h1>
  <div class="date">Generated: ${new Date().toLocaleString()}</div>

  <div class="summary">
    <h2>Summary</h2>
    <div class="summary-item"><strong>Total Users:</strong> ${users.length}</div>
    <div class="summary-item"><strong>Total Videos:</strong> ${videos.length}</div>
    <div class="summary-item"><strong>Total Subscriptions:</strong> ${subscriptions.length}</div>
    <div class="summary-item"><strong>Active Subscriptions:</strong> ${subscriptions.filter(s => s.status === 'ACTIVE').length}</div>
    <div class="summary-item"><strong>Total Marketers:</strong> ${marketers.length}</div>
    <div class="summary-item"><strong>Active Marketers:</strong> ${marketers.filter(m => m.isActive).length}</div>
  </div>

  <h2>Users</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Created</th>
        <th>Locale</th>
        <th>Country</th>
      </tr>
    </thead>
    <tbody>
      ${users.map(user => `
        <tr>
          <td>${user.id}</td>
          <td>${(user.name || 'N/A').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          <td>${user.email}</td>
          <td>${user.createdAt.toLocaleDateString()}</td>
          <td>${user.locale || 'N/A'}</td>
          <td>${user.country || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Videos</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Status</th>
        <th>User</th>
        <th>Created</th>
        <th>Completed</th>
      </tr>
    </thead>
    <tbody>
      ${videos.map(video => `
        <tr>
          <td>${video.id}</td>
          <td>${(video.title || 'N/A').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          <td>${video.status}</td>
          <td>${(video.user?.name || video.user?.email || 'N/A').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          <td>${video.createdAt.toLocaleDateString()}</td>
          <td>${video.completedAt ? video.completedAt.toLocaleDateString() : 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Subscriptions</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Tier</th>
        <th>Status</th>
        <th>User</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      ${subscriptions.map(sub => `
        <tr>
          <td>${sub.id}</td>
          <td>${sub.tier}</td>
          <td>${sub.status}</td>
          <td>${(sub.user?.name || sub.user?.email || 'N/A').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          <td>${sub.createdAt.toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${marketers.length > 0 ? `
  <h2>Marketers</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Code</th>
        <th>Commission %</th>
        <th>Active</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      ${marketers.map(marketer => `
        <tr>
          <td>${marketer.id}</td>
          <td>${marketer.name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          <td>${marketer.code}</td>
          <td>${marketer.baseCommissionPercentage}%</td>
          <td>${marketer.isActive ? 'Yes' : 'No'}</td>
          <td>${marketer.createdAt.toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}
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
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="marketup-report-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

