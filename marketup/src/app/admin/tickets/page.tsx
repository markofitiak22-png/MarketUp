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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    urgentTickets: 0
  });

  // Fetch tickets from API
  const fetchTickets = async (page: number = currentPage) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus,
        priority: filterPriority,
        category: filterCategory,
        subscription: filterSubscription,
        sortBy,
        sortOrder,
        page: page.toString(),
        limit: '10'
      });
      
      const response = await fetch(`/api/admin/tickets?${params}`, {
        credentials: "include",
      });
      const data = await response.json();
      
      if (data.success) {
        setTickets(data.data.tickets);
        setPagination(data.data.pagination);
        setCurrentPage(data.data.pagination.page);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      } else {
        console.error('Failed to fetch tickets:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchTickets(1);
  }, [searchTerm, filterStatus, filterPriority, filterCategory, filterSubscription, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      fetchTickets(page);
    }
  };

  // Handle escape key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    if (showModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Apply styles to prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showModal]);

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
        fetchTickets(currentPage); // Refresh current page
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
        fetchTickets(currentPage); // Refresh current page
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
        fetchTickets(currentPage); // Refresh current page
      } else {
        console.error('Failed to assign ticket:', data.error);
        alert(translations.adminTicketsFailedToAssignTicket);
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      alert(translations.adminTicketsErrorAssigningTicket);
    }
  };

  // Tickets are already filtered by the API
  const filteredTickets = tickets;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full mr-1.5 sm:mr-2"></div>
            {translations.adminTicketsOpen || "Open"}
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
            {translations.adminTicketsInProgress || "In Progress"}
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {translations.adminTicketsResolved || "Resolved"}
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {translations.adminTicketsClosed || "Closed"}
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
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11.11" />
            </svg>
            {translations.adminTicketsUrgent || "Urgent"}
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {translations.adminTicketsHigh || "High"}
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {translations.adminTicketsMedium || "Medium"}
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {translations.adminTicketsLow || "Low"}
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "billing":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case "feature_request":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case "bug_report":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "general":
      default:
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
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
    
    if (diffInHours < 1) return translations.adminTicketsJustNow || "Just now";
    if (diffInHours < 24) return `${diffInHours}${translations.adminTicketsHoursAgo || "h ago"}`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}${translations.adminTicketsDaysAgo || "d ago"}`;
    return formatDate(dateString);
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
        {/* Shared background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 space-y-8 p-3 sm:p-6 lg:p-8">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-800/40 rounded mb-6"></div>
              <div className="h-64 bg-slate-800/40 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
      {/* Shared background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top left blob */}
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Top right blob */}
        <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Middle left blob */}
        <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        {/* Middle right blob */}
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        {/* Bottom left blob */}
        <div className="absolute top-[80%] left-[15%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        {/* Bottom right blob */}
        <div className="absolute top-[90%] right-[5%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        {/* Additional connecting blobs */}
        <div className="absolute top-[35%] left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[45%] right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[70%] left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[75%] right-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        {/* Header Section with Badge */}
        <div className="mb-4 sm:mb-8">
          <div className="hidden sm:flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>{translations.adminTicketsSupportTickets || "Support Tickets"}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              {translations.adminTicketsSupportTickets || "Support Tickets"}
            </h1>
            <p className="text-sm sm:text-base text-white/60">
              {translations.adminTicketsManageCustomerSupport || "Manage customer support tickets"}
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Tickets */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTicketsTotalTickets || "Total"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.totalTickets}
              </p>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-red-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500/10 to-red-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTicketsOpen || "Open"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.openTickets}
              </p>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-yellow-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTicketsInProgress || "In Progress"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.inProgressTickets}
              </p>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-green-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500/10 to-green-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTicketsResolved || "Resolved"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.resolvedTickets}
              </p>
            </div>
          </div>

          {/* Urgent */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-orange-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500/10 to-orange-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTicketsUrgent || "Urgent"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.urgentTickets}
              </p>
            </div>
          </div>
        </div>

        {/* Full Width Layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Filters and Search */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.adminSearch || "Search"}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="relative sm:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={translations.adminTicketsSearchPlaceholder || "Search tickets..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">{translations.adminTicketsAllStatus || "All Status"}</option>
                  <option value="open">{translations.adminTicketsOpen || "Open"}</option>
                  <option value="in_progress">{translations.adminTicketsInProgress || "In Progress"}</option>
                  <option value="resolved">{translations.adminTicketsResolved || "Resolved"}</option>
                  <option value="closed">{translations.adminTicketsClosed || "Closed"}</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">{translations.adminTicketsAllPriority || "All Priority"}</option>
                  <option value="urgent">{translations.adminTicketsUrgent || "Urgent"}</option>
                  <option value="high">{translations.adminTicketsHigh || "High"}</option>
                  <option value="medium">{translations.adminTicketsMedium || "Medium"}</option>
                  <option value="low">{translations.adminTicketsLow || "Low"}</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">{translations.adminTicketsAllCategories || "All Categories"}</option>
                  <option value="technical">{translations.adminTicketsTechnical || "Technical"}</option>
                  <option value="billing">{translations.adminTicketsBilling || "Billing"}</option>
                  <option value="feature_request">{translations.adminTicketsFeatureRequest || "Feature Request"}</option>
                  <option value="bug_report">{translations.adminTicketsBugReport || "Bug Report"}</option>
                  <option value="general">{translations.adminTicketsGeneral || "General"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-lg animate-pulse">
                      <div className="w-12 h-12 bg-slate-700/60 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700/60 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-700/60 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-6 bg-slate-700/60 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{translations.adminNoTicketsFound || "No tickets found"}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-white/60">{translations.adminTryDifferentFilters || "Try different filters or search terms"}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/60 border-b-2 border-slate-700/80 sticky top-0 z-20">
                      <tr>
                        <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[200px]">{translations.adminUser || "User"}</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[250px]">{translations.adminTicketsSubject || "Subject"}</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[120px]">{translations.adminTicketsCategory || "Category"}</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[100px]">{translations.adminTicketsPriority || "Priority"}</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[100px]">{translations.adminTicketsStatus || "Status"}</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[180px]">{translations.adminTicketsDate || "Date"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-slate-800/60 transition-all duration-200 group border-b border-slate-700/60">
                          <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-w-[200px]">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs sm:text-sm font-bold">
                                  {ticket.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate mb-0.5">{ticket.user.name}</p>
                                <p className="text-xs sm:text-sm lg:text-base text-white/70 truncate">{ticket.user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[250px]">
                            <div className="flex flex-col gap-1">
                              <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">{ticket.subject}</p>
                              <p className="text-xs sm:text-sm lg:text-base text-white/70 line-clamp-2">{ticket.description}</p>
                            </div>
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[120px]">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800/40 flex items-center justify-center text-indigo-400">
                                {getCategoryIcon(ticket.category)}
                              </div>
                              <span className="text-xs sm:text-sm lg:text-base text-white/80 capitalize">
                                {ticket.category.replace('_', ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[100px]">
                            {getPriorityBadge(ticket.priority)}
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[100px]">
                            <div className="flex flex-col items-start gap-2">
                              {getStatusBadge(ticket.status)}
                              <button
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setShowModal(true);
                                }}
                                className="px-2 sm:px-3 py-1 sm:py-1 bg-slate-800/40 hover:bg-slate-800/60 text-white text-xs sm:text-sm font-semibold rounded-lg border border-slate-700/60 hover:border-slate-600/60 transition-all duration-300"
                              >
                                {translations.adminTicketsView || "View"}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[180px]">
                            <span className="text-xs sm:text-sm lg:text-base text-white/70 block">{formatDate(ticket.createdAt)}</span>
                            <span className="text-xs sm:text-sm text-white/50 block mt-1">{getTimeAgo(ticket.lastMessageAt)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-sm sm:text-base text-white/60">
                {translations.adminShowingTickets || "Showing"} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {translations.adminOfTickets || "of"} {pagination.total} {translations.adminTicketsTickets || "tickets"}
              </p>
              {pagination.pages > 1 && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {translations.adminPrevious || "Previous"}
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                              : 'bg-slate-800/40 border border-slate-700/60 text-white hover:bg-slate-800/60 hover:scale-105'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {translations.adminNext || "Next"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ticket Details Modal */}
        {showModal && selectedTicket && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 sm:p-6 lg:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-6xl w-full max-h-[85vh] overflow-y-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{selectedTicket.subject}</h2>
                      <p className="text-xs sm:text-sm lg:text-base text-white/60">{selectedTicket.id}</p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(85vh-100px)]">
                  {/* Ticket Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminTicketsTicketInformation || "Ticket Information"}</h3>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <div><span className="font-bold text-white/60">{translations.adminTicketsStatus || "Status"}:</span> <span className="text-white">{getStatusBadge(selectedTicket.status)}</span></div>
                        <div><span className="font-bold text-white/60">{translations.adminTicketsPriority || "Priority"}:</span> <span className="text-white">{getPriorityBadge(selectedTicket.priority)}</span></div>
                        <div><span className="font-bold text-white/60">{translations.adminTicketsCategory || "Category"}:</span> <span className="text-white capitalize">{selectedTicket.category.replace('_', ' ')}</span></div>
                        <div><span className="font-bold text-white/60">Created:</span> <span className="text-white">{formatDate(selectedTicket.createdAt)}</span></div>
                        <div><span className="font-bold text-white/60">Updated:</span> <span className="text-white">{formatDate(selectedTicket.updatedAt)}</span></div>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminTicketsUserInformation || "User Information"}</h3>
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {selectedTicket.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="text-base sm:text-lg font-bold text-white">{selectedTicket.user.name}</div>
                          <div className="text-sm sm:text-base text-white/60">{selectedTicket.user.email}</div>
                          <div className="text-xs sm:text-sm text-indigo-400 font-bold capitalize">{selectedTicket.user.subscription}</div>
                        </div>
                      </div>
                      {selectedTicket.assignedAdmin && (
                        <div className="text-xs sm:text-sm">
                          <span className="font-bold text-white/60">{translations.adminTicketsAssignedTo || "Assigned to"}:</span> <span className="text-white">{selectedTicket.assignedAdmin.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminTicketsDescription || "Description"}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-white/80">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminTicketsConversation || "Conversation"}</h3>
                    <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto">
                      {selectedTicket.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs sm:max-w-md px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl ${
                            message.sender === "admin" 
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                              : "bg-slate-700/40 text-white"
                          }`}>
                            <div className="text-xs sm:text-sm lg:text-base font-bold mb-1 sm:mb-2">{message.senderName}</div>
                            <div className="text-xs sm:text-sm lg:text-base">{message.content}</div>
                            <div className="text-xs sm:text-sm opacity-75 mt-1 sm:mt-2">
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 sm:pt-4 border-t border-slate-700/60 space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value as Ticket["status"])}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                      >
                        <option value="open">{translations.adminTicketsOpen || "Open"}</option>
                        <option value="in_progress">{translations.adminTicketsInProgress || "In Progress"}</option>
                        <option value="resolved">{translations.adminTicketsResolved || "Resolved"}</option>
                        <option value="closed">{translations.adminTicketsClosed || "Closed"}</option>
                      </select>
                      
                      {!selectedTicket.assignedAdmin && (
                        <button
                          onClick={() => handleAssignTicket(selectedTicket.id, "Admin")}
                          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg sm:rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 text-xs sm:text-sm font-bold hover:scale-105"
                        >
                          {translations.adminTicketsAssignToMe || "Assign to Me"}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder={translations.adminTicketsTypeYourResponse || "Type your response..."}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-700/60 bg-slate-800/40 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent text-xs sm:text-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-bold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                      >
                        {translations.adminTicketsSend || "Send"}
                      </button>
                    </div>
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
