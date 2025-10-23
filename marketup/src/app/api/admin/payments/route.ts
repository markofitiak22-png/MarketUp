import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    console.log('Admin Payments API - User ID:', userId);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';
    const method = searchParams.get('method') || 'all';
    const dateRange = searchParams.get('dateRange') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { note: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Status filter
    if (status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      where.createdAt = {
        gte: startDate
      };
    }

    // Map frontend sortBy to actual database field names
    const sortByMapping: { [key: string]: string } = {
      'createdAt': 'createdAt',
      'amount': 'amountCents',
      'status': 'status',
      'user': 'user'
    };
    
    const actualSortBy = sortByMapping[sortBy] || 'createdAt';

    // Get manual payments with related data
    const [payments, totalCount] = await Promise.all([
      prisma.manualPayment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: sortBy === 'user' ? { user: { name: sortOrder as 'asc' | 'desc' } } : {
          [actualSortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.manualPayment.count({ where })
    ]);

    // Transform payments data to match frontend interface
    const transformedPayments = payments.map(payment => {
      // Map database status to frontend status
      let frontendStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
      switch (payment.status) {
        case 'PENDING':
          frontendStatus = 'pending';
          break;
        case 'APPROVED':
          frontendStatus = 'completed';
          break;
        case 'REJECTED':
          frontendStatus = 'failed';
          break;
        default:
          frontendStatus = 'pending';
      }

      // Convert amount from cents to dollars
      const amount = payment.amountCents / 100;

      // Generate invoice number
      const invoiceNumber = `INV-${payment.createdAt.getFullYear()}-${payment.id.slice(-6).toUpperCase()}`;

      // Generate avatar URL
      const avatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&sig=${payment.user?.id || 'default'}`;

      return {
        id: payment.id,
        userId: payment.userId,
        user: {
          name: payment.user?.name || 'Unknown User',
          email: payment.user?.email || 'No email',
          avatar: avatarUrl
        },
        amount: amount,
        currency: payment.currency,
        status: frontendStatus,
        paymentMethod: 'bank_transfer', // Manual payments are typically bank transfers
        transactionType: 'one_time', // Manual payments are typically one-time
        description: payment.note || 'Manual Payment',
        createdAt: payment.createdAt.toISOString(),
        processedAt: payment.status === 'APPROVED' ? payment.createdAt.toISOString() : undefined,
        failureReason: payment.status === 'REJECTED' ? 'Payment rejected' : undefined,
        invoiceNumber: invoiceNumber,
        metadata: {
          planName: 'Manual Payment',
          billingCycle: 'one-time'
        }
      };
    });

    // Apply client-side filtering for type and method (since we're using calculated fields)
    let filteredPayments = transformedPayments;

    if (type !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.transactionType === type);
    }

    if (method !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.paymentMethod === method);
    }

    console.log('Admin Payments API - Found payments:', filteredPayments.length);

    return NextResponse.json({
      success: true,
      data: {
        payments: filteredPayments,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        },
        filters: {
          search,
          status,
          type,
          method,
          dateRange,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error("Admin payments API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, action, reason } = body;

    let newStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    
    switch (action) {
      case 'confirm':
        newStatus = 'APPROVED';
        break;
      case 'reject':
        newStatus = 'REJECTED';
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update payment status
    const updatedPayment = await prisma.manualPayment.update({
      where: { id: paymentId },
      data: {
        status: newStatus
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedPayment
    });

  } catch (error) {
    console.error("Update payment error:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
