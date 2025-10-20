import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "overview";

    // Mock data - replace with actual database queries
    const billingData = {
      overview: {
        currentPeriod: {
          start: "2024-01-15",
          end: "2024-02-15",
          amount: 29.00,
          status: "active"
        },
        usage: {
          videos: 8,
          storage: 2.4,
          bandwidth: 15.2
        },
        paymentMethod: {
          type: "Visa",
          last4: "4242",
          expiry: "12/26"
        }
      },
      invoices: [
        {
          id: "INV-001",
          date: "2024-01-15",
          amount: 29.00,
          status: "Paid",
          description: "Pro Plan - Monthly"
        },
        {
          id: "INV-002",
          date: "2023-12-15",
          amount: 29.00,
          status: "Paid",
          description: "Pro Plan - Monthly"
        },
        {
          id: "INV-003",
          date: "2023-11-15",
          amount: 29.00,
          status: "Paid",
          description: "Pro Plan - Monthly"
        }
      ],
      paymentMethods: [
        {
          id: 1,
          type: "Visa",
          last4: "4242",
          expiry: "12/26",
          isDefault: true
        }
      ],
      usage: {
        videos: {
          current: 8,
          limit: "unlimited",
          percentage: 20
        },
        storage: {
          current: 2.4,
          limit: 10,
          percentage: 24
        },
        bandwidth: {
          current: 15.2,
          limit: "unlimited",
          percentage: 5
        }
      }
    };

    return NextResponse.json(billingData[tab as keyof typeof billingData] || billingData.overview);
  } catch (error) {
    console.error("Dashboard billing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
