"use client";

import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled";
  paymentMethod: "credit_card" | "paypal" | "stripe" | "bank_transfer" | "crypto";
  transactionType: "subscription" | "one_time" | "refund" | "upgrade";
  description: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  subscriptionId?: string;
  invoiceNumber: string;
  metadata?: {
    planName?: string;
    billingCycle?: string;
    discountCode?: string;
    taxAmount?: number;
  };
}

export default function PaymentManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "failed" | "refunded" | "cancelled">("all");
  const [filterType, setFilterType] = useState<"all" | "subscription" | "one_time" | "refund" | "upgrade">("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "amount" | "status" | "user">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month" | "year">("all");

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          status: filterStatus,
          type: filterType,
          method: filterMethod,
          dateRange,
          sortBy,
          sortOrder
        });
        
        const response = await fetch(`/api/admin/payments?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setTransactions(data.data.payments);
        } else {
          console.error('Failed to fetch payments:', data.error);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [searchTerm, filterStatus, filterType, filterMethod, dateRange, sortBy, sortOrder]);

  const handleConfirmPayment = async (transactionId: string) => {
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: transactionId,
          action: 'confirm'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTransactions(prev => prev.map(txn => 
          txn.id === transactionId 
            ? { 
                ...txn, 
                status: "completed" as const, 
                processedAt: new Date().toISOString() 
              } 
            : txn
        ));
        setShowModal(false);
        setSelectedTransaction(null);
      } else {
        console.error('Failed to confirm payment:', data.error);
        alert('Failed to confirm payment. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Error confirming payment. Please try again.');
    }
  };

  const handleRefundPayment = async (transactionId: string, reason: string) => {
    try {
      // For now, we'll just update the UI since we don't have a refund action in the API
      // In a real app, you'd need to implement refund logic
      setTransactions(prev => prev.map(txn => 
        txn.id === transactionId 
          ? { 
              ...txn, 
              status: "refunded" as const, 
              processedAt: new Date().toISOString(),
              failureReason: reason
            } 
          : txn
      ));
      setShowModal(false);
      setSelectedTransaction(null);
      alert('Refund functionality would be implemented here');
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Error processing refund. Please try again.');
    }
  };

  const handleCancelPayment = async (transactionId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: transactionId,
          action: 'reject',
          reason
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTransactions(prev => prev.map(txn => 
          txn.id === transactionId 
            ? { 
                ...txn, 
                status: "failed" as const, 
                processedAt: new Date().toISOString(),
                failureReason: reason
              } 
            : txn
        ));
        setShowModal(false);
        setSelectedTransaction(null);
      } else {
        console.error('Failed to cancel payment:', data.error);
        alert('Failed to cancel payment. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling payment:', error);
      alert('Error cancelling payment. Please try again.');
    }
  };

  // Transactions are already filtered and sorted by the API
  const filteredTransactions = transactions;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-400 rounded-full mr-1 sm:mr-1.5 animate-pulse"></div>
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Failed
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Refunded
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return "💳";
      case "paypal":
        return "🅿️";
      case "stripe":
        return "💳";
      case "bank_transfer":
        return "🏦";
      case "crypto":
        return "₿";
      default:
        return "💳";
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return "🔄";
      case "one_time":
        return "💳";
      case "refund":
        return "↩️";
      case "upgrade":
        return "⬆️";
      default:
        return "💳";
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

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "BTC") {
      return `${amount} BTC`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(amount);
  };

  const getTotalStats = () => {
    const total = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    const completed = transactions.filter(txn => txn.status === "completed").reduce((sum, txn) => sum + txn.amount, 0);
    const pending = transactions.filter(txn => txn.status === "pending").length;
    const failed = transactions.filter(txn => txn.status === "failed").length;
    
    return { total, completed, pending, failed };
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
            Payment Management
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed px-4">
            View and manage payment transactions
          </p>
          <div className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-foreground-muted">
            <span className="font-bold text-foreground text-lg sm:text-xl lg:text-2xl">{filteredTransactions.length}</span> transactions
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">Total Revenue</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{formatAmount(stats.total, "USD")}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">Completed</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{formatAmount(stats.completed, "USD")}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">Pending</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.pending}</p>
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
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-1 sm:mb-2">Failed</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.failed}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">Search & Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
                Search
              </label>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Types</option>
                <option value="subscription">Subscription</option>
                <option value="one_time">One Time</option>
                <option value="refund">Refund</option>
                <option value="upgrade">Upgrade</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
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
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 sm:p-6 lg:p-8 hover:bg-surface/50 transition-all duration-300 hover:scale-[1.01] group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-6">
                      {/* User Avatar */}
                      <img
                        src={transaction.user.avatar}
                        alt={transaction.user.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform"
                      />

                      {/* Transaction Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mb-2 sm:mb-3">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">{transaction.user.name}</h3>
                          <span className="text-sm sm:text-base lg:text-lg text-foreground-muted hidden sm:inline">•</span>
                          <span className="text-sm sm:text-base lg:text-lg text-foreground-muted truncate">{transaction.user.email}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg text-foreground-muted mb-3 sm:mb-4">
                          <span className="truncate">{transaction.description}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs sm:text-sm lg:text-base">Invoice: {transaction.invoiceNumber}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs sm:text-sm lg:text-base">{formatDate(transaction.createdAt)}</span>
                        </div>

                        {/* Payment Details */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <span className="text-xs sm:text-sm lg:text-base bg-surface-elevated px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold">
                            {getPaymentMethodIcon(transaction.paymentMethod)} {transaction.paymentMethod.replace('_', ' ')}
                          </span>
                          <span className="text-xs sm:text-sm lg:text-base bg-surface-elevated px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold">
                            {getTransactionTypeIcon(transaction.transactionType)} {transaction.transactionType.replace('_', ' ')}
                          </span>
                          {transaction.metadata?.planName && (
                            <span className="text-xs sm:text-sm lg:text-base bg-accent/10 text-accent px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold">
                              {transaction.metadata.planName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                          {formatAmount(transaction.amount, transaction.currency)}
                        </div>
                        <div className="mt-1 sm:mt-2">
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3 w-full sm:w-auto">
                        {transaction.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleConfirmPayment(transaction.id)}
                              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white text-sm sm:text-base lg:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-green-600 transition-all duration-300 hover:scale-105 flex-1 sm:flex-none"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt("Enter cancellation reason:");
                                if (reason) handleCancelPayment(transaction.id, reason);
                              }}
                              className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white text-sm sm:text-base lg:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-red-600 transition-all duration-300 hover:scale-105 flex-1 sm:flex-none"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {transaction.status === "completed" && (
                          <button
                            onClick={() => {
                              const reason = prompt("Enter refund reason:");
                              if (reason) handleRefundPayment(transaction.id, reason);
                            }}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-sm sm:text-base lg:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-blue-600 transition-all duration-300 hover:scale-105 flex-1 sm:flex-none"
                          >
                            Refund
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowModal(true);
                          }}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-surface text-foreground text-sm sm:text-base lg:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-surface-elevated transition-all duration-300 hover:scale-105 flex-1 sm:flex-none"
                        >
                          View
                        </button>
                      </div>

                      {transaction.failureReason && (
                        <div className="text-base text-red-500 max-w-48 text-right">
                          {transaction.failureReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>

        {/* Transaction Details Modal */}
        {showModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="glass-elevated rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-foreground">Transaction Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-3 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Transaction Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Transaction Information</h3>
                    <div className="space-y-3 text-lg">
                      <div><span className="font-bold">ID:</span> {selectedTransaction.id}</div>
                      <div><span className="font-bold">Invoice:</span> {selectedTransaction.invoiceNumber}</div>
                      <div><span className="font-bold">Amount:</span> {formatAmount(selectedTransaction.amount, selectedTransaction.currency)}</div>
                      <div><span className="font-bold">Status:</span> {selectedTransaction.status}</div>
                      <div><span className="font-bold">Created:</span> {formatDate(selectedTransaction.createdAt)}</div>
                      {selectedTransaction.processedAt && (
                        <div><span className="font-bold">Processed:</span> {formatDate(selectedTransaction.processedAt)}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">User Information</h3>
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={selectedTransaction.user.avatar}
                        alt={selectedTransaction.user.name}
                        className="w-16 h-16 rounded-2xl"
                      />
                      <div>
                        <div className="text-xl font-bold text-foreground">{selectedTransaction.user.name}</div>
                        <div className="text-lg text-foreground-muted">{selectedTransaction.user.email}</div>
                      </div>
                    </div>
                    <div className="space-y-3 text-lg">
                      <div><span className="font-bold">Payment Method:</span> {selectedTransaction.paymentMethod}</div>
                      <div><span className="font-bold">Type:</span> {selectedTransaction.transactionType}</div>
                      <div><span className="font-bold">Description:</span> {selectedTransaction.description}</div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                {selectedTransaction.metadata && (
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Additional Information</h3>
                    <div className="glass-elevated rounded-2xl p-6 space-y-3 text-lg">
                      {selectedTransaction.metadata.planName && (
                        <div><span className="font-bold">Plan:</span> {selectedTransaction.metadata.planName}</div>
                      )}
                      {selectedTransaction.metadata.billingCycle && (
                        <div><span className="font-bold">Billing:</span> {selectedTransaction.metadata.billingCycle}</div>
                      )}
                      {selectedTransaction.metadata.discountCode && (
                        <div><span className="font-bold">Discount:</span> {selectedTransaction.metadata.discountCode}</div>
                      )}
                      {selectedTransaction.metadata.taxAmount && (
                        <div><span className="font-bold">Tax:</span> {formatAmount(selectedTransaction.metadata.taxAmount, "USD")}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedTransaction.status === "pending" && (
                  <div className="flex justify-end space-x-6 pt-6 border-t border-border">
                    <button
                      onClick={() => {
                        const reason = prompt("Enter cancellation reason:");
                        if (reason) handleCancelPayment(selectedTransaction.id, reason);
                      }}
                      className="px-8 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 text-lg font-bold hover:scale-105"
                    >
                      Cancel Payment
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Enter refund reason:");
                        if (reason) handleRefundPayment(selectedTransaction.id, reason);
                      }}
                      className="px-8 py-4 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition-all duration-300 text-lg font-bold hover:scale-105"
                    >
                      Refund
                    </button>
                    <button
                      onClick={() => handleConfirmPayment(selectedTransaction.id)}
                      className="px-8 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-300 text-lg font-bold hover:scale-105"
                    >
                      Confirm Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
