import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = ((session as any).user as any).id;
    console.log('Admin Tickets API - User ID:', userId);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';
    const category = searchParams.get('category') || 'all';
    const subscription = searchParams.get('subscription') || 'all';
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Status filter
    if (status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Priority filter
    if (priority !== 'all') {
      where.priority = priority.toUpperCase();
    }

    // Category filter
    if (category !== 'all') {
      where.category = category.toUpperCase();
    }

    // Subscription filter
    if (subscription !== 'all') {
      where.user = {
        subscriptions: {
          some: {
            tier: subscription.toUpperCase()
          }
        }
      };
    }

    // Map frontend sortBy to actual database field names
    const sortByMapping: { [key: string]: string } = {
      'createdAt': 'createdAt',
      'updatedAt': 'createdAt', // ContactMessage doesn't have updatedAt, use createdAt
      'priority': 'priority',
      'status': 'status'
    };
    
    const actualSortBy = sortByMapping[sortBy] || 'createdAt';

    // Get contact messages (tickets) with related data
    const [tickets, totalCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              subscriptions: {
                where: { status: 'ACTIVE' },
                select: { tier: true }
              }
            }
          }
        },
        orderBy: {
          [actualSortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.contactMessage.count({ where })
    ]);

    // Transform tickets data to match frontend interface
    const transformedTickets = tickets.map(ticket => {
      // Map database status to frontend status
      let frontendStatus: 'open' | 'in_progress' | 'resolved' | 'closed';
      switch (ticket.status || 'PENDING') {
        case 'PENDING':
          frontendStatus = 'open';
          break;
        case 'IN_PROGRESS':
          frontendStatus = 'in_progress';
          break;
        case 'RESOLVED':
          frontendStatus = 'resolved';
          break;
        case 'CLOSED':
          frontendStatus = 'closed';
          break;
        default:
          frontendStatus = 'open';
      }

      // Map database priority to frontend priority
      let frontendPriority: 'low' | 'medium' | 'high' | 'urgent';
      switch (ticket.priority || 'MEDIUM') {
        case 'LOW':
          frontendPriority = 'low';
          break;
        case 'MEDIUM':
          frontendPriority = 'medium';
          break;
        case 'HIGH':
          frontendPriority = 'high';
          break;
        case 'URGENT':
          frontendPriority = 'urgent';
          break;
        default:
          frontendPriority = 'medium';
      }

      // Map database category to frontend category
      let frontendCategory: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
      switch (ticket.category || 'GENERAL') {
        case 'TECHNICAL':
          frontendCategory = 'technical';
          break;
        case 'BILLING':
          frontendCategory = 'billing';
          break;
        case 'FEATURE_REQUEST':
          frontendCategory = 'feature_request';
          break;
        case 'BUG_REPORT':
          frontendCategory = 'bug_report';
          break;
        case 'GENERAL':
        default:
          frontendCategory = 'general';
      }

      // Get user subscription tier
      const subscriptionTier = ticket.user?.subscriptions?.[0]?.tier || 'BASIC';
      const frontendSubscription = subscriptionTier === 'BASIC' ? 'basic' : 
                                  subscriptionTier === 'STANDARD' ? 'premium' : 
                                  subscriptionTier === 'PREMIUM' ? 'enterprise' : 'basic';

      // Generate avatar URL
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.user?.email || ticket.user?.id || 'default'}&backgroundColor=b6e3f4`;

      // Generate ticket ID
      const ticketId = `TKT-${ticket.createdAt.getFullYear()}-${ticket.id.slice(-6).toUpperCase()}`;

      // Create mock messages array (in a real app, you'd have a separate messages table)
      const messages = [
        {
          id: `msg_${ticket.id}`,
          content: ticket.message,
          sender: 'user' as const,
          senderName: ticket.user?.name || 'Unknown User',
          timestamp: ticket.createdAt.toISOString()
        }
      ];

      return {
        id: ticketId,
        subject: ticket.name || 'No Subject',
        description: ticket.message,
        status: frontendStatus,
        priority: frontendPriority,
        category: frontendCategory,
        user: {
          id: ticket.user?.id || 'unknown',
          name: ticket.user?.name || 'Unknown User',
          email: ticket.user?.email || 'No email',
          avatar: avatarUrl,
          subscription: frontendSubscription
        },
        assignedTo: undefined,
        assignedAdmin: undefined,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.createdAt.toISOString(),
        lastMessageAt: ticket.createdAt.toISOString(),
        messages: messages,
        tags: [frontendCategory, frontendPriority],
        isPremium: frontendSubscription !== 'basic'
      };
    });

    // Apply client-side filtering for subscription (since we're using calculated fields)
    let filteredTickets = transformedTickets;

    if (subscription !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.user.subscription === subscription);
    }

    console.log('Admin Tickets API - Found tickets:', filteredTickets.length);

    return NextResponse.json({
      success: true,
      data: {
        tickets: filteredTickets,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        },
        filters: {
          search,
          status,
          priority,
          category,
          subscription,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error("Admin tickets API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ticketId, action, data } = body;

    // Extract the actual contact message ID from the ticket ID
    const contactMessageId = ticketId.split('-').pop()?.toLowerCase();
    
    if (!contactMessageId) {
      return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
    }

    let updateData: any = {};

    switch (action) {
      case 'updateStatus':
        updateData.status = data.status.toUpperCase();
        break;
      case 'assign':
        // In a real app, you'd have an assignment system
        updateData.status = 'IN_PROGRESS';
        break;
      case 'addMessage':
        // In a real app, you'd add this to a messages table
        // For now, we'll just update the contact message
        updateData.message = `${data.message}\n\n--- Admin Response ---\n${data.content}`;
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update contact message
    const updatedTicket = await prisma.contactMessage.update({
      where: { id: contactMessageId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedTicket
    });

  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
