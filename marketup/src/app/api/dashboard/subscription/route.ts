import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock data - replace with actual database queries
    const subscription = {
      currentPlan: {
        name: "Pro Plan",
        price: 29,
        period: "month",
        status: "active",
        nextBilling: "2024-02-15",
        features: [
          "Unlimited video creation",
          "HD video export",
          "Custom branding",
          "Priority support",
          "Advanced analytics"
        ]
      },
      usage: {
        videos: 8,
        storage: 2.4,
        bandwidth: 15.2
      },
      availablePlans: [
        {
          name: "Free",
          price: 0,
          period: "month",
          features: [
            "3 videos per month",
            "Standard quality",
            "Basic templates",
            "Community support"
          ],
          current: false,
          popular: false
        },
        {
          name: "Pro",
          price: 29,
          period: "month",
          features: [
            "Unlimited videos",
            "HD quality",
            "Custom branding",
            "Priority support",
            "Advanced analytics"
          ],
          current: true,
          popular: true
        },
        {
          name: "Enterprise",
          price: 99,
          period: "month",
          features: [
            "Everything in Pro",
            "White-label solution",
            "API access",
            "Dedicated support",
            "Custom integrations"
          ],
          current: false,
          popular: false
        }
      ]
    };

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Dashboard subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, action } = await request.json();

    // Handle subscription changes
    switch (action) {
      case "upgrade":
        // TODO: Implement plan upgrade logic
        return NextResponse.json({ message: "Plan upgrade initiated" });
      
      case "downgrade":
        // TODO: Implement plan downgrade logic
        return NextResponse.json({ message: "Plan downgrade initiated" });
      
      case "cancel":
        // TODO: Implement cancellation logic
        return NextResponse.json({ message: "Subscription cancelled" });
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Dashboard subscription update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
