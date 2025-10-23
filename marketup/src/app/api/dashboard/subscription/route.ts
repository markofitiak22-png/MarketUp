import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
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

    // Get billing history (mock data for now)
    const billingHistory = [
      {
        id: 'inv_001',
        date: subscription?.currentPeriodStart?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        description: `${subscription?.tier || 'Free'} Plan - ${subscription?.tier === 'BASIC' ? 'Monthly' : subscription?.tier === 'STANDARD' ? 'Monthly' : subscription?.tier === 'PREMIUM' ? 'Monthly' : 'Free'}`,
        amount: subscription?.tier === 'BASIC' ? '$9.00' : subscription?.tier === 'STANDARD' ? '$29.00' : subscription?.tier === 'PREMIUM' ? '$99.00' : '$0.00',
        status: 'Paid'
      }
    ];

    // Define available plans
    const availablePlans = [
      {
        name: "Free",
        tier: "FREE",
        price: 0,
        period: "month",
        features: [
          "3 videos per month",
          "Standard quality",
          "Basic templates",
          "Community support"
        ],
        current: !subscription,
        popular: false
      },
      {
        name: "Basic",
        tier: "BASIC",
        price: 9,
        period: "month",
        features: [
          "10 videos per month",
          "HD quality",
          "Custom branding",
          "Email support",
          "Basic analytics"
        ],
        current: subscription?.tier === 'BASIC',
        popular: false
      },
      {
        name: "Pro",
        tier: "STANDARD",
        price: 29,
        period: "month",
        features: [
          "Unlimited videos",
          "HD quality",
          "Custom branding",
          "Priority support",
          "Advanced analytics",
          "API access"
        ],
        current: subscription?.tier === 'STANDARD',
        popular: true
      },
      {
        name: "Enterprise",
        tier: "PREMIUM",
        price: 99,
        period: "month",
        features: [
          "Everything in Pro",
          "White-label solution",
          "API access",
          "Dedicated support",
          "Custom integrations",
          "On-premise deployment"
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
          limit: currentPlan.tier === 'FREE' ? 3 : 
                 currentPlan.tier === 'BASIC' ? 10 : 
                 'unlimited'
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