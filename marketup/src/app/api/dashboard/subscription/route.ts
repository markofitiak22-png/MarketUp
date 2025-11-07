import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as { id: string }).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = ((session as any).user as { id: string }).id;

    // Get user's subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get user's video usage this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const videosThisMonth = await prisma.videoJob.count({
      where: {
        userId,
        createdAt: {
          gte: thisMonth
        }
      }
    });

    // Get total videos created
    const totalVideos = await prisma.videoJob.count({
      where: { userId }
    });

    // Get billing history from actual payments
    const payments = await prisma.manualPayment.findMany({
      where: {
        userId,
        status: 'APPROVED'
      },
      orderBy: { createdAt: 'desc' },
      take: 12 // Last 12 months
    });

    const billingHistory = payments.map((payment) => {
      const invoiceDate = payment.createdAt.toISOString().split('T')[0];
      const invoiceNumber = `INV-${payment.createdAt.getFullYear()}-${payment.id.slice(-6).toUpperCase()}`;
      
      // Extract plan name from payment note
      let planName = 'Pro';
      if (payment.note?.includes('Plan:')) {
        const planMatch = payment.note.match(/Plan: (\w+)/i);
        if (planMatch) {
          const planId = planMatch[1].toLowerCase();
          planName = planId === 'pro' ? 'Pro' : 
                     planId === 'premium' ? 'Premium' : 'Free';
        }
      }

      return {
        id: invoiceNumber,
        date: invoiceDate,
        description: `${planName} Plan - Monthly`,
        amount: `$${(payment.amountCents / 100).toFixed(2)}`,
        status: 'Paid',
        downloadUrl: `/api/billing/invoice/${payment.id}`
      };
    });

    // Define available plans (matching pricing page)
    const availablePlans = [
      {
        name: "Free",
        tier: "FREE",
        price: 0,
        period: "forever",
        features: [
          "1 video per month",
          "Standard quality",
          "No subtitles",
          "Limited avatars",
          "No social publishing",
          "Default backgrounds",
          "Additional support"
        ],
        current: !subscription,
        popular: false
      },
      {
        name: "Pro",
        tier: "STANDARD",
        price: 42,
        period: "month",
        features: [
          "4 videos per month",
          "HD quality",
          "Subtitles included",
          "Extended avatars",
          "Social publishing",
          "2 background images",
          "Team support",
          "Company info"
        ],
        current: subscription?.tier === 'STANDARD',
        popular: true
      },
      {
        name: "Premium",
        tier: "PREMIUM",
        price: 59,
        period: "month",
        features: [
          "7 videos per month",
          "4K quality",
          "Subtitles included",
          "Full avatars",
          "Social publishing",
          "4 background images",
          "Team support",
          "Company info",
          "Template access",
          "Marketing support",
          "Video analytics",
          "Cloud library",
          "Verified partner"
        ],
        current: subscription?.tier === 'PREMIUM',
        popular: false
      }
    ];

    // Current plan info
    const currentPlan = subscription ? {
      name: availablePlans.find(p => p.tier === subscription.tier)?.name || 'Unknown',
      tier: subscription.tier,
      price: availablePlans.find(p => p.tier === subscription.tier)?.price || 0,
      period: "month",
      features: availablePlans.find(p => p.tier === subscription.tier)?.features || [],
      nextBilling: subscription.currentPeriodEnd.toISOString().split('T')[0],
      status: subscription.status.toLowerCase(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
    } : {
      name: "Free",
      tier: "FREE",
      price: 0,
      period: "month",
      features: availablePlans[0].features,
      nextBilling: null,
      status: "active",
      cancelAtPeriodEnd: false
    };

    return NextResponse.json({
      success: true,
      data: {
        currentPlan,
        availablePlans,
        usage: {
          videosThisMonth,
          totalVideos,
          limit: currentPlan.tier === 'FREE' ? 1 : 
                 currentPlan.tier === 'STANDARD' ? 4 : 
                 currentPlan.tier === 'PREMIUM' ? 7 : 1
        },
        billingHistory
      }
    });

  } catch (error) {
    console.error("Subscription data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}