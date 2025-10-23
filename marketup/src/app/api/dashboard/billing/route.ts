import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id: string }).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Get user's subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get usage data for current month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const [videosThisMonth, totalVideos, storageUsed] = await Promise.all([
      prisma.videoJob.count({
        where: {
          userId,
          createdAt: {
            gte: thisMonth
          }
        }
      }),
      prisma.videoJob.count({
        where: { userId }
      }),
      prisma.videoJob.aggregate({
        where: { userId },
        _sum: { fileSize: true }
      })
    ]);

    // Calculate storage in GB
    const storageUsedGB = storageUsed._sum.fileSize ? 
      Math.round((storageUsed._sum.fileSize / (1024 * 1024 * 1024)) * 100) / 100 : 0;

    // Mock bandwidth calculation (in real app, this would be tracked)
    const bandwidthUsed = Math.round(videosThisMonth * 0.5 * 100) / 100; // 0.5GB per video

    // Current billing period
    const currentPeriod = subscription ? {
      start: subscription.currentPeriodStart.toISOString().split('T')[0],
      end: subscription.currentPeriodEnd.toISOString().split('T')[0],
      amount: subscription.tier === 'BASIC' ? 9.00 : 
              subscription.tier === 'STANDARD' ? 29.00 : 
              subscription.tier === 'PREMIUM' ? 99.00 : 0.00,
      status: subscription.status.toLowerCase(),
      planName: subscription.tier === 'BASIC' ? 'Basic Plan' :
                subscription.tier === 'STANDARD' ? 'Pro Plan' :
                subscription.tier === 'PREMIUM' ? 'Enterprise Plan' : 'Free Plan'
    } : {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: 0.00,
      status: 'active',
      planName: 'Free Plan'
    };

    // Usage data
    const usage = {
      videos: videosThisMonth,
      storage: storageUsedGB,
      bandwidth: bandwidthUsed,
      totalVideos,
      storageLimit: !subscription ? 1 : 
                   subscription.tier === 'BASIC' ? 5 : 
                   subscription.tier === 'STANDARD' ? 10 : 50, // GB
      videoLimit: !subscription ? 3 : 
                 subscription.tier === 'BASIC' ? 10 : 'unlimited'
    };

    // Mock payment method (in real app, this would come from payment provider)
    const paymentMethod = subscription ? {
      type: "Visa",
      last4: "4242",
      expiry: "12/26",
      brand: "visa"
    } : null;

    // Mock invoices (in real app, this would come from payment provider)
    const invoices = subscription ? [
      {
        id: `INV-${Date.now().toString().slice(-6)}`,
        date: subscription.currentPeriodStart.toISOString().split('T')[0],
        amount: currentPeriod.amount,
        status: "Paid",
        description: `${currentPeriod.planName} - Monthly`,
        downloadUrl: `/api/billing/invoice/${Date.now().toString().slice(-6)}`
      }
    ] : [];

    // Add more historical invoices if user has been subscribed longer
    if (subscription) {
      const monthsAgo = Math.floor((Date.now() - subscription.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
      for (let i = 1; i <= Math.min(monthsAgo, 3); i++) {
        const invoiceDate = new Date(subscription.createdAt);
        invoiceDate.setMonth(invoiceDate.getMonth() + i);
        
        invoices.push({
          id: `INV-${(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toString().slice(-6)}`,
          date: invoiceDate.toISOString().split('T')[0],
          amount: currentPeriod.amount,
          status: "Paid",
          description: `${currentPeriod.planName} - Monthly`,
          downloadUrl: `/api/billing/invoice/${(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toString().slice(-6)}`
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        currentPeriod,
        usage,
        paymentMethod,
        invoices: invoices.reverse() // Show newest first
      }
    });

  } catch (error) {
    console.error("Billing data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}