import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// GET /api/admin/marketers - Get all marketers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const marketers = await prisma.marketer.findMany({
      include: {
        referralCodes: {
          include: {
            events: {
              where: { status: "APPROVED" },
              include: {
                referredUser: {
                  select: { id: true, email: true, name: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Calculate stats for each marketer
    const marketersWithStats = marketers.map(marketer => {
      const allEvents = marketer.referralCodes.flatMap(code => code.events);
      const totalReferrals = allEvents.length;
      const totalCommission = allEvents.reduce((sum, event) => {
        return sum + (event.commissionAmountCents || 0);
      }, 0);
      const paidCommission = allEvents
        .filter(event => event.commissionPaid)
        .reduce((sum, event) => sum + (event.commissionAmountCents || 0), 0);
      const pendingCommission = totalCommission - paidCommission;

      return {
        ...marketer,
        stats: {
          totalReferrals,
          totalCommission,
          paidCommission,
          pendingCommission
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: marketersWithStats
    });
  } catch (error) {
    console.error('Error fetching marketers:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/marketers - Create a new marketer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, baseCommissionPercentage, tieredCommissions, code } = body;

    if (!name || baseCommissionPercentage === undefined) {
      return NextResponse.json({ error: "Name and base commission percentage are required" }, { status: 400 });
    }

    // Generate code if not provided
    let marketerCode = code?.toUpperCase() || nanoid(8).toUpperCase();
    
    // Ensure code is unique
    const existingCode = await prisma.marketer.findUnique({
      where: { code: marketerCode }
    });

    if (existingCode) {
      marketerCode = nanoid(8).toUpperCase();
    }

    // Validate tiered commissions format
    if (tieredCommissions && !Array.isArray(tieredCommissions)) {
      return NextResponse.json({ error: "Tiered commissions must be an array" }, { status: 400 });
    }

    if (tieredCommissions) {
      for (const tier of tieredCommissions) {
        if (typeof tier.userCount !== 'number' || typeof tier.percentage !== 'number') {
          return NextResponse.json({ error: "Invalid tiered commission format. Each tier must have userCount and percentage" }, { status: 400 });
        }
      }
    }

    // Get or create a system user for marketers (for referrerId requirement)
    // This is a workaround since ReferralEvent requires a referrerId
    let systemUser = await prisma.user.findFirst({
      where: { email: "system@marketup.com" }
    });

    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          email: "system@marketup.com",
          name: "System User"
        }
      });
    }

    // Create marketer
    const marketer = await prisma.marketer.create({
      data: {
        name,
        code: marketerCode,
        baseCommissionPercentage: parseFloat(baseCommissionPercentage),
        tieredCommissions: tieredCommissions || null,
        isActive: true
      }
    });

    // Create a referral code for this marketer
    // Use system user as owner for referrerId requirement
    const referralCode = await prisma.referralCode.create({
      data: {
        code: marketerCode,
        marketerId: marketer.id,
        ownerId: systemUser.id // Use system user for referrerId requirement
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        marketer,
        referralCode
      }
    });
  } catch (error: any) {
    console.error('Error creating marketer:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Code already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/marketers - Update a marketer
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, baseCommissionPercentage, tieredCommissions, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Marketer ID is required" }, { status: 400 });
    }

    // Validate tiered commissions if provided
    if (tieredCommissions !== undefined) {
      if (!Array.isArray(tieredCommissions)) {
        return NextResponse.json({ error: "Tiered commissions must be an array" }, { status: 400 });
      }

      for (const tier of tieredCommissions) {
        if (typeof tier.userCount !== 'number' || typeof tier.percentage !== 'number') {
          return NextResponse.json({ error: "Invalid tiered commission format" }, { status: 400 });
        }
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (baseCommissionPercentage !== undefined) updateData.baseCommissionPercentage = parseFloat(baseCommissionPercentage);
    if (tieredCommissions !== undefined) updateData.tieredCommissions = tieredCommissions;
    if (isActive !== undefined) updateData.isActive = isActive;

    const marketer = await prisma.marketer.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: marketer
    });
  } catch (error: any) {
    console.error('Error updating marketer:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Marketer not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/marketers - Delete a marketer
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Marketer ID is required" }, { status: 400 });
    }

    // Check if marketer has any referral events
    const marketer = await prisma.marketer.findUnique({
      where: { id },
      include: {
        referralCodes: {
          include: {
            events: true
          }
        }
      }
    });

    if (!marketer) {
      return NextResponse.json({ error: "Marketer not found" }, { status: 404 });
    }

    const hasEvents = marketer.referralCodes.some(code => code.events.length > 0);

    if (hasEvents) {
      // Deactivate instead of delete
      await prisma.marketer.update({
        where: { id },
        data: { isActive: false }
      });

      return NextResponse.json({
        success: true,
        message: "Marketer deactivated (has referral events)",
        data: { deactivated: true }
      });
    } else {
      // Delete referral codes first
      await prisma.referralCode.deleteMany({
        where: { marketerId: id }
      });

      // Delete marketer
      await prisma.marketer.delete({
        where: { id }
      });

      return NextResponse.json({
        success: true,
        message: "Marketer deleted"
      });
    }
  } catch (error: any) {
    console.error('Error deleting marketer:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Marketer not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

