"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscription: "basic" | "premium" | "enterprise";
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "admin";
  senderName: string;
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "feature_request" | "bug_report" | "general";
  user: User;
  assignedTo?: string;
  assignedAdmin?: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  messages: Message[];
  tags: string[];
  isPremium: boolean;
}

export default function TicketSystem() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "in_progress" | "resolved" | "closed">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high" | "urgent">("all");
  const [filterCategory, setFilterCategory] = useState<"all" | "technical" | "billing" | "feature_request" | "bug_report" | "general">("all");
  const [filterSubscription, setFilterSubscription] = useState<"all" | "premium" | "enterprise">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "priority" | "status">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Simulate fetching tickets
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTickets: Ticket[] = [
        {
          id: "TKT-001",
          subject: "Video processing is taking too long",
          description: "My videos are taking over 2 hours to process, which is much longer than usual. This is affecting my workflow significantly.",
          status: "open",
          priority: "high",
          category: "technical",
          user: {
            id: "user_001",
            name: "John Smith",
            email: "john@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            subscription: "premium"
          },
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T14:20:00Z",
          lastMessageAt: "2024-01-15T14:20:00Z",
          isPremium: true,
          tags: ["video-processing", "performance"],
          messages: [
            {
              id: "msg_001",
              content: "Hi, I'm experiencing slow video processing times. My videos usually take 30 minutes but now they're taking over 2 hours. This is really impacting my productivity.",
              sender: "user",
              senderName: "John Smith",
              timestamp: "2024-01-15T10:30:00Z"
            },
            {
              id: "msg_002",
              content: "Thank you for reaching out, John. I understand this is frustrating. Let me investigate this issue for you. Can you please provide the video file sizes and formats you're working with?",
              sender: "admin",
              senderName: "Sarah Johnson",
              timestamp: "2024-01-15T11:15:00Z"
            },
            {
              id: "msg_003",
              content: "Sure! I'm working with MP4 files, mostly 1080p, ranging from 500MB to 2GB. The processing used to be much faster last week.",
              sender: "user",
              senderName: "John Smith",
              timestamp: "2024-01-15T14:20:00Z"
            }
          ]
        },
        {
          id: "TKT-002",
          subject: "Billing issue with annual subscription",
          description: "I was charged twice for my annual subscription and need a refund for the duplicate charge.",
          status: "in_progress",
          priority: "medium",
          category: "billing",
          user: {
            id: "user_002",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
            subscription: "enterprise"
          },
          assignedTo: "admin_001",
          assignedAdmin: {
            name: "Mike Wilson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          },
          createdAt: "2024-01-14T15:45:00Z",
          updatedAt: "2024-01-15T09:30:00Z",
          lastMessageAt: "2024-01-15T09:30:00Z",
          isPremium: true,
          tags: ["billing", "refund"],
          messages: [
            {
              id: "msg_004",
              content: "I was charged $199.99 twice for my annual subscription on January 10th. I need a refund for the duplicate charge.",
              sender: "user",
              senderName: "Sarah Johnson",
              timestamp: "2024-01-14T15:45:00Z"
            },
            {
              id: "msg_005",
              content: "I&apos;ve reviewed your account and can confirm the duplicate charge. I&apos;ll process the refund within 3-5 business days. You&apos;ll receive an email confirmation once it&apos;s processed.",
              sender: "admin",
              senderName: "Mike Wilson",
              timestamp: "2024-01-15T09:30:00Z"
            }
          ]
        },
        {
          id: "TKT-003",
          subject: "Feature request: Bulk video upload",
          description: "It would be great to have a bulk upload feature for multiple videos at once. Currently, I have to upload them one by one.",
          status: "resolved",
          priority: "low",
          category: "feature_request",
          user: {
            id: "user_003",
            name: "Mike Wilson",
            email: "mike@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            subscription: "premium"
          },
          assignedTo: "admin_002",
          assignedAdmin: {
            name: "Emily Davis",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
          },
          createdAt: "2024-01-13T08:20:00Z",
          updatedAt: "2024-01-14T16:45:00Z",
          lastMessageAt: "2024-01-14T16:45:00Z",
          isPremium: true,
          tags: ["feature-request", "bulk-upload"],
          messages: [
            {
              id: "msg_006",
              content: "I'd love to see a bulk upload feature for multiple videos. Currently, uploading 20+ videos takes a very long time.",
              sender: "user",
              senderName: "Mike Wilson",
              timestamp: "2024-01-13T08:20:00Z"
            },
            {
              id: "msg_007",
              content: "Thank you for the suggestion! This feature is already in our roadmap for Q2 2024. I&apos;ll add your vote to this feature request.",
              sender: "admin",
              senderName: "Emily Davis",
              timestamp: "2024-01-14T16:45:00Z"
            }
          ]
        },
        {
          id: "TKT-004",
          subject: "Bug: Video player not loading on mobile",
          description: "The video player is not loading properly on mobile devices. It shows a black screen instead of the video.",
          status: "open",
          priority: "urgent",
          category: "bug_report",
          user: {
            id: "user_004",
            name: "Emily Davis",
            email: "emily@example.com",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
            subscription: "enterprise"
          },
          createdAt: "2024-01-12T14:30:00Z",
          updatedAt: "2024-01-12T14:30:00Z",
          lastMessageAt: "2024-01-12T14:30:00Z",
          isPremium: true,
          tags: ["mobile", "video-player", "bug"],
          messages: [
            {
              id: "msg_008",
              content: "The video player is completely broken on mobile. I'm using iPhone 14 with Safari browser. The video just shows a black screen.",
              sender: "user",
              senderName: "Emily Davis",
              timestamp: "2024-01-12T14:30:00Z"
            }
          ]
        },
        {
          id: "TKT-005",
          subject: "General inquiry about API access",
          description: "I'm interested in accessing your API for custom integrations. What are the available endpoints and rate limits?",
          status: "closed",
          priority: "medium",
          category: "general",
          user: {
            id: "user_005",
            name: "Alex Brown",
            email: "alex@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            subscription: "premium"
          },
          assignedTo: "admin_003",
          assignedAdmin: {
            name: "Lisa Chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
          },
          createdAt: "2024-01-11T09:15:00Z",
          updatedAt: "2024-01-12T10:30:00Z",
          lastMessageAt: "2024-01-12T10:30:00Z",
          isPremium: true,
          tags: ["api", "integration"],
          messages: [
            {
              id: "msg_009",
              content: "I'd like to integrate your video processing API into my application. Can you provide documentation and rate limit information?",
              sender: "user",
              senderName: "Alex Brown",
              timestamp: "2024-01-11T09:15:00Z"
            },
            {
              id: "msg_010",
              content: "I've sent you the API documentation via email. The rate limits are 1000 requests per hour for premium users. Let me know if you need any clarification!",
              sender: "admin",
              senderName: "Lisa Chen",
              timestamp: "2024-01-12T10:30:00Z"
            }
          ]
        }
      ];
      
      setTickets(mockTickets);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      content: newMessage,
      sender: "admin",
      senderName: "Admin",
      timestamp: new Date().toISOString()
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { 
            ...ticket, 
            messages: [...ticket.messages, newMsg],
            updatedAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString()
          } 
        : ticket
    ));

    setNewMessage("");
  };

  const handleUpdateStatus = (ticketId: string, status: Ticket["status"]) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status, updatedAt: new Date().toISOString() } 
        : ticket
    ));
  };

  const handleAssignTicket = (ticketId: string, adminName: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            assignedTo: "admin_001",
            assignedAdmin: { name: adminName, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
            updatedAt: new Date().toISOString()
          } 
        : ticket
    ));
  };

  const filteredTickets = tickets
    .filter(ticket => {
      const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
      const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
      const matchesCategory = filterCategory === "all" || ticket.category === filterCategory;
      const matchesSubscription = filterSubscription === "all" || ticket.user.subscription === filterSubscription;
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesCategory && matchesSubscription && matchesSearch;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "updatedAt":
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></div>
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5 animate-pulse"></div>
            In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Resolved
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            🔥 Urgent
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            ⚡ High
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            📋 Medium
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            📝 Low
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return "🔧";
      case "billing":
        return "💳";
      case "feature_request":
        return "💡";
      case "bug_report":
        return "🐛";
      case "general":
        return "📋";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const getTotalStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === "open").length;
    const inProgress = tickets.filter(t => t.status === "in_progress").length;
    const resolved = tickets.filter(t => t.status === "resolved").length;
    const urgent = tickets.filter(t => t.priority === "urgent").length;
    
    return { total, open, inProgress, resolved, urgent };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ticket System</h1>
          <p className="text-foreground-muted mt-2">
            Manage customer support tickets for premium clients
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-foreground-muted">
            <span className="font-bold text-foreground">{filteredTickets.length}</span> tickets
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Total Tickets</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Open</p>
              <p className="text-2xl font-bold text-foreground">{stats.open}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">In Progress</p>
              <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Resolved</p>
              <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Urgent</p>
              <p className="text-2xl font-bold text-foreground">{stats.urgent}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="feature_request">Feature Request</option>
              <option value="bug_report">Bug Report</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Subscription Filter */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Subscription
            </label>
            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Subscriptions</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-surface-elevated rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <div className="w-12 h-12 bg-surface rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-surface rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-surface rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-surface/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <img
                      src={ticket.user.avatar}
                      alt={ticket.user.name}
                      className="w-12 h-12 rounded-full"
                    />

                    {/* Ticket Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground">{ticket.subject}</h3>
                        <span className="text-sm text-foreground-muted">•</span>
                        <span className="text-sm text-foreground-muted">{ticket.id}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-foreground-muted mb-2">
                        <span>{ticket.user.name}</span>
                        <span>•</span>
                        <span>{ticket.user.email}</span>
                        <span>•</span>
                        <span className="capitalize">{ticket.user.subscription}</span>
                      </div>

                      <p className="text-sm text-foreground-muted mb-3 line-clamp-2">
                        {ticket.description}
                      </p>

                      {/* Tags and Metadata */}
                      <div className="flex items-center space-x-4">
                        <span className="text-xs bg-surface px-2 py-1 rounded-full">
                          {getCategoryIcon(ticket.category)} {ticket.category.replace('_', ' ')}
                        </span>
                        {ticket.assignedAdmin && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                            Assigned to {ticket.assignedAdmin.name}
                          </span>
                        )}
                        <span className="text-xs text-foreground-muted">
                          {ticket.messages.length} messages
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {getTimeAgo(ticket.lastMessageAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end space-y-3">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowModal(true);
                        }}
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-bold"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedTicket.subject}</h2>
                  <p className="text-sm text-foreground-muted">{selectedTicket.id}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-foreground-muted hover:text-foreground"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">Ticket Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-bold">Status:</span> {getStatusBadge(selectedTicket.status)}</div>
                    <div><span className="font-bold">Priority:</span> {getPriorityBadge(selectedTicket.priority)}</div>
                    <div><span className="font-bold">Category:</span> {getCategoryIcon(selectedTicket.category)} {selectedTicket.category.replace('_', ' ')}</div>
                    <div><span className="font-bold">Created:</span> {formatDate(selectedTicket.createdAt)}</div>
                    <div><span className="font-bold">Updated:</span> {formatDate(selectedTicket.updatedAt)}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">User Information</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={selectedTicket.user.avatar}
                      alt={selectedTicket.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-bold text-foreground">{selectedTicket.user.name}</div>
                      <div className="text-sm text-foreground-muted">{selectedTicket.user.email}</div>
                      <div className="text-xs text-accent font-bold capitalize">{selectedTicket.user.subscription}</div>
                    </div>
                  </div>
                  {selectedTicket.assignedAdmin && (
                    <div className="text-sm">
                      <span className="font-bold">Assigned to:</span> {selectedTicket.assignedAdmin.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">Description</h3>
                <p className="text-foreground-muted bg-surface-elevated p-4 rounded-xl">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Messages */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">Conversation</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                        message.sender === "admin" 
                          ? "bg-accent text-white" 
                          : "bg-surface-elevated text-foreground"
                      }`}>
                        <div className="text-sm font-bold mb-1">{message.senderName}</div>
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="flex space-x-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value as Ticket["status"])}
                    className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  {!selectedTicket.assignedAdmin && (
                    <button
                      onClick={() => handleAssignTicket(selectedTicket.id, "Admin")}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold"
                    >
                      Assign to Me
                    </button>
                  )}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your response..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
