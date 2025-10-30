"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

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
  const { translations } = useTranslations();
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

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          status: filterStatus,
          priority: filterPriority,
          category: filterCategory,
          subscription: filterSubscription,
          sortBy,
          sortOrder
        });
        
        const response = await fetch(`/api/admin/tickets?${params}`, {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.success) {
          setTickets(data.data.tickets);
        } else {
          console.error('Failed to fetch tickets:', data.error);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
      setLoading(false);
      }
    };

    fetchTickets();
  }, [searchTerm, filterStatus, filterPriority, filterCategory, filterSubscription, sortBy, sortOrder]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const response = await fetch('/api/admin/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          action: 'addMessage',
          data: {
            content: newMessage
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
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
      } else {
        console.error('Failed to send message:', data.error);
        alert(translations.adminTicketsFailedToSendMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(translations.adminTicketsErrorSendingMessage);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: Ticket["status"]) => {
    try {
      const response = await fetch('/api/admin/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          ticketId,
          action: 'updateStatus',
          data: {
            status
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status, updatedAt: new Date().toISOString() } 
        : ticket
    ));
      } else {
        console.error('Failed to update status:', data.error);
        alert(translations.adminTicketsFailedToUpdateStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(translations.adminTicketsErrorUpdatingStatus);
    }
  };

  const handleAssignTicket = async (ticketId: string, adminName: string) => {
    try {
      const response = await fetch('/api/admin/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          ticketId,
          action: 'assign',
          data: {
            adminName
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            assignedTo: "admin_001",
            assignedAdmin: { name: adminName, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName}&backgroundColor=b6e3f4` },
            updatedAt: new Date().toISOString()
          } 
        : ticket
    ));
      } else {
        console.error('Failed to assign ticket:', data.error);
        alert(translations.adminTicketsFailedToAssignTicket);
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      alert(translations.adminTicketsErrorAssigningTicket);
    }
  };

  // Tickets are already filtered and sorted by the API
  const filteredTickets = tickets;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-400 rounded-full mr-1 sm:mr-1.5"></div>
            {translations.adminTicketsOpen}
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-400 rounded-full mr-1 sm:mr-1.5 animate-pulse"></div>
            {translations.adminTicketsInProgress}
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {translations.adminTicketsResolved}
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-foreground-muted">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {translations.adminTicketsClosed}
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
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            🔥 {translations.adminTicketsUrgent}
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            ⚡ {translations.adminTicketsHigh}
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            📋 {translations.adminTicketsMedium}
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            📝 {translations.adminTicketsLow}
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
    
    if (diffInHours < 1) return translations.adminTicketsJustNow;
    if (diffInHours < 24) return `${diffInHours}${translations.adminTicketsHoursAgo}`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}${translations.adminTicketsDaysAgo}`;
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent mb-4 sm:mb-6">
            {translations.adminTicketsSupportTickets}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed px-4">
            {translations.adminTicketsManageCustomerSupport}
          </p>
          <div className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-foreground-muted">
            <span className="font-bold text-foreground text-lg sm:text-xl lg:text-2xl">{filteredTickets.length}</span> {translations.adminTicketsTickets}
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">{translations.adminTicketsTotalTickets}</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.total}</p>
            </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z"/>
              </svg>
            </div>
          </div>
        </div>

          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">{translations.adminTicketsOpen}</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.open}</p>
            </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
        </div>

          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">{translations.adminTicketsInProgress}</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.inProgress}</p>
            </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">{translations.adminTicketsResolved}</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.resolved}</p>
            </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">{translations.adminTicketsUrgent}</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.urgent}</p>
            </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

        {/* Enhanced Filters */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600 sm:w-6 sm:h-6 lg:w-8 lg:h-8">
                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">{translations.adminTicketsSearchFilters}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Search */}
          <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
              {translations.adminTicketsSearch}
            </label>
            <input
              type="text"
              placeholder={translations.adminTicketsSearchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Status Filter */}
          <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
              {translations.adminTicketsStatus}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
            >
              <option value="all">{translations.adminTicketsAllStatus}</option>
              <option value="open">{translations.adminTicketsOpen}</option>
              <option value="in_progress">{translations.adminTicketsInProgress}</option>
              <option value="resolved">{translations.adminTicketsResolved}</option>
              <option value="closed">{translations.adminTicketsClosed}</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
              {translations.adminTicketsPriority}
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
            >
              <option value="all">{translations.adminTicketsAllPriority}</option>
              <option value="urgent">{translations.adminTicketsUrgent}</option>
              <option value="high">{translations.adminTicketsHigh}</option>
              <option value="medium">{translations.adminTicketsMedium}</option>
              <option value="low">{translations.adminTicketsLow}</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
              {translations.adminTicketsCategory}
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
            >
              <option value="all">{translations.adminTicketsAllCategories}</option>
              <option value="technical">{translations.adminTicketsTechnical}</option>
              <option value="billing">{translations.adminTicketsBilling}</option>
              <option value="feature_request">{translations.adminTicketsFeatureRequest}</option>
              <option value="bug_report">{translations.adminTicketsBugReport}</option>
              <option value="general">{translations.adminTicketsGeneral}</option>
            </select>
          </div>

          {/* Subscription Filter */}
          <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
              {translations.adminTicketsSubscription}
            </label>
            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
            >
              <option value="all">{translations.adminTicketsAllSubscriptions}</option>
              <option value="premium">{translations.adminTicketsPremium}</option>
              <option value="enterprise">{translations.adminTicketsEnterprise}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
        {loading ? (
            <div className="p-4 sm:p-6 lg:p-10">
              <div className="space-y-4 sm:space-y-6">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 sm:space-x-6 p-4 sm:p-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-surface-elevated rounded-xl sm:rounded-2xl animate-pulse"></div>
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      <div className="h-4 sm:h-5 bg-surface-elevated rounded animate-pulse w-3/4"></div>
                      <div className="h-3 sm:h-4 bg-surface-elevated rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="w-16 sm:w-20 lg:w-24 h-6 sm:h-8 bg-surface-elevated rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 sm:p-6 lg:p-8 hover:bg-surface/50 transition-all duration-300 hover:scale-[1.01] group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start space-x-3 sm:space-x-6">
                    {/* User Avatar */}
                    <img
                      src={ticket.user.avatar}
                      alt={ticket.user.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform"
                    />

                    {/* Ticket Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mb-2 sm:mb-3">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">{ticket.subject}</h3>
                          <span className="text-sm sm:text-base lg:text-lg text-foreground-muted hidden sm:inline">•</span>
                          <span className="text-sm sm:text-base lg:text-lg text-foreground-muted truncate">{ticket.id}</span>
                      </div>
                      
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg text-foreground-muted mb-3 sm:mb-4">
                        <span className="truncate">{ticket.user.name}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs sm:text-sm lg:text-base truncate">{ticket.user.email}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs sm:text-sm lg:text-base capitalize">{ticket.user.subscription}</span>
                      </div>

                        <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-3 sm:mb-4 line-clamp-2">
                        {ticket.description}
                      </p>

                      {/* Tags and Metadata */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <span className="text-xs sm:text-sm lg:text-base bg-surface-elevated px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold">
                          {getCategoryIcon(ticket.category)} {ticket.category.replace('_', ' ')}
                        </span>
                        {ticket.assignedAdmin && (
                            <span className="text-xs sm:text-sm lg:text-base bg-accent/10 text-accent px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold">
                            {translations.adminTicketsAssignedTo} {ticket.assignedAdmin.name}
                          </span>
                        )}
                          <span className="text-xs sm:text-sm lg:text-base text-foreground-muted">
                          {ticket.messages.length} {translations.adminTicketsMessages}
                        </span>
                          <span className="text-xs sm:text-sm lg:text-base text-foreground-muted">
                          {getTimeAgo(ticket.lastMessageAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>

                      <div className="flex w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowModal(true);
                        }}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-accent text-white rounded-xl sm:rounded-2xl hover:bg-accent-hover transition-all duration-300 text-sm sm:text-base lg:text-lg font-bold hover:scale-105 flex-1 sm:flex-none"
                      >
                        {translations.adminTicketsView}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300">
            <div className="glass-elevated rounded-2xl sm:rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-in zoom-in-95 duration-300">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{selectedTicket.subject}</h2>
                    <p className="text-sm sm:text-base lg:text-lg text-foreground-muted">{selectedTicket.id}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                    className="p-2 sm:p-3 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110"
                >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

              <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Ticket Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">{translations.adminTicketsTicketInformation}</h3>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg">
                    <div><span className="font-bold">{translations.adminTicketsStatus}:</span> {getStatusBadge(selectedTicket.status)}</div>
                    <div><span className="font-bold">{translations.adminTicketsPriority}:</span> {getPriorityBadge(selectedTicket.priority)}</div>
                    <div><span className="font-bold">{translations.adminTicketsCategory}:</span> {getCategoryIcon(selectedTicket.category)} {selectedTicket.category.replace('_', ' ')}</div>
                    <div><span className="font-bold">Created:</span> {formatDate(selectedTicket.createdAt)}</div>
                    <div><span className="font-bold">Updated:</span> {formatDate(selectedTicket.updatedAt)}</div>
                  </div>
                </div>

                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">{translations.adminTicketsUserInformation}</h3>
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <img
                      src={selectedTicket.user.avatar}
                      alt={selectedTicket.user.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl"
                    />
                    <div>
                        <div className="text-lg sm:text-xl font-bold text-foreground">{selectedTicket.user.name}</div>
                        <div className="text-sm sm:text-base lg:text-lg text-foreground-muted">{selectedTicket.user.email}</div>
                        <div className="text-xs sm:text-sm lg:text-base text-accent font-bold capitalize">{selectedTicket.user.subscription}</div>
                      </div>
                  </div>
                  {selectedTicket.assignedAdmin && (
                      <div className="text-sm sm:text-base lg:text-lg">
                      <span className="font-bold">{translations.adminTicketsAssignedTo}:</span> {selectedTicket.assignedAdmin.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">{translations.adminTicketsDescription}</h3>
                  <p className="text-sm sm:text-base lg:text-lg text-foreground-muted bg-surface-elevated p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Messages */}
              <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">{translations.adminTicketsConversation}</h3>
                  <div className="space-y-4 sm:space-y-6 max-h-60 sm:max-h-80 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs sm:max-w-md px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl ${
                        message.sender === "admin" 
                          ? "bg-accent text-white" 
                          : "bg-surface-elevated text-foreground"
                      }`}>
                          <div className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">{message.senderName}</div>
                          <div className="text-sm sm:text-base lg:text-lg">{message.content}</div>
                          <div className="text-xs sm:text-sm lg:text-base opacity-75 mt-1 sm:mt-2">
                          {formatDate(message.timestamp)}
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 sm:pt-6 border-t border-border space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value as Ticket["status"])}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-foreground text-sm sm:text-base lg:text-lg"
                  >
                    <option value="open">{translations.adminTicketsOpen}</option>
                    <option value="in_progress">{translations.adminTicketsInProgress}</option>
                    <option value="resolved">{translations.adminTicketsResolved}</option>
                    <option value="closed">{translations.adminTicketsClosed}</option>
                  </select>
                  
                  {!selectedTicket.assignedAdmin && (
                    <button
                      onClick={() => handleAssignTicket(selectedTicket.id, "Admin")}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-xl sm:rounded-2xl hover:bg-blue-600 transition-all duration-300 text-sm sm:text-base lg:text-lg font-bold hover:scale-105"
                    >
                      {translations.adminTicketsAssignToMe}
                    </button>
                  )}
                </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder={translations.adminTicketsTypeYourResponse}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base lg:text-lg"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-accent text-white rounded-xl sm:rounded-2xl hover:bg-accent-hover transition-all duration-300 text-sm sm:text-base lg:text-lg font-bold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {translations.adminTicketsSend}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
