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

  // Simulate fetching transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTransactions: Transaction[] = [
        {
          id: "txn_001",
          userId: "user_001",
          user: {
            name: "John Smith",
            email: "john@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
          },
          amount: 29.99,
          currency: "USD",
          status: "pending",
          paymentMethod: "credit_card",
          transactionType: "subscription",
          description: "Premium Monthly Subscription",
          createdAt: "2024-01-15T10:30:00Z",
          invoiceNumber: "INV-2024-001",
          metadata: {
            planName: "Premium Plan",
            billingCycle: "monthly",
            taxAmount: 2.40
          }
        },
        {
          id: "txn_002",
          userId: "user_002",
          user: {
            name: "Sarah Johnson",
            email: "sarah@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
          },
          amount: 99.99,
          currency: "USD",
          status: "completed",
          paymentMethod: "paypal",
          transactionType: "subscription",
          description: "Enterprise Annual Subscription",
          createdAt: "2024-01-14T15:45:00Z",
          processedAt: "2024-01-14T15:47:00Z",
          invoiceNumber: "INV-2024-002",
          metadata: {
            planName: "Enterprise Plan",
            billingCycle: "annual",
            discountCode: "SAVE20",
            taxAmount: 8.00
          }
        },
        {
          id: "txn_003",
          userId: "user_003",
          user: {
            name: "Mike Wilson",
            email: "mike@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          },
          amount: 15.00,
          currency: "USD",
          status: "failed",
          paymentMethod: "stripe",
          transactionType: "one_time",
          description: "Video Processing Credits",
          createdAt: "2024-01-13T08:20:00Z",
          failureReason: "Insufficient funds",
          invoiceNumber: "INV-2024-003"
        },
        {
          id: "txn_004",
          userId: "user_004",
          user: {
            name: "Emily Davis",
            email: "emily@example.com",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
          },
          amount: 49.99,
          currency: "USD",
          status: "refunded",
          paymentMethod: "credit_card",
          transactionType: "refund",
          description: "Premium Monthly Subscription - Refund",
          createdAt: "2024-01-12T14:30:00Z",
          processedAt: "2024-01-12T16:45:00Z",
          invoiceNumber: "INV-2024-004",
          metadata: {
            planName: "Premium Plan",
            billingCycle: "monthly"
          }
        },
        {
          id: "txn_005",
          userId: "user_005",
          user: {
            name: "Alex Brown",
            email: "alex@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          },
          amount: 199.99,
          currency: "USD",
          status: "completed",
          paymentMethod: "bank_transfer",
          transactionType: "upgrade",
          description: "Upgrade to Enterprise Plan",
          createdAt: "2024-01-11T09:15:00Z",
          processedAt: "2024-01-11T09:18:00Z",
          invoiceNumber: "INV-2024-005",
          metadata: {
            planName: "Enterprise Plan",
            billingCycle: "annual"
          }
        },
        {
          id: "txn_006",
          userId: "user_006",
          user: {
            name: "Lisa Chen",
            email: "lisa@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
          },
          amount: 0.05,
          currency: "BTC",
          status: "completed",
          paymentMethod: "crypto",
          transactionType: "one_time",
          description: "Crypto Payment Test",
          createdAt: "2024-01-10T20:30:00Z",
          processedAt: "2024-01-10T20:35:00Z",
          invoiceNumber: "INV-2024-006"
        }
      ];
      
      setTransactions(mockTransactions);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const handleConfirmPayment = async (transactionId: string) => {
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
  };

  const handleRefundPayment = async (transactionId: string, reason: string) => {
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
  };

  const handleCancelPayment = async (transactionId: string, reason: string) => {
    setTransactions(prev => prev.map(txn => 
      txn.id === transactionId 
        ? { 
            ...txn, 
            status: "cancelled" as const, 
            processedAt: new Date().toISOString(),
            failureReason: reason
          } 
        : txn
    ));
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
      const matchesType = filterType === "all" || transaction.transactionType === filterType;
      const matchesMethod = filterMethod === "all" || transaction.paymentMethod === filterMethod;
      const matchesSearch = transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date filtering
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();
      let matchesDate = true;
      
      switch (dateRange) {
        case "today":
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= monthAgo;
          break;
        case "year":
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= yearAgo;
          break;
      }
      
      return matchesStatus && matchesType && matchesMethod && matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "user":
          aValue = a.user.name.toLowerCase();
          bValue = b.user.name.toLowerCase();
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
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5 animate-pulse"></div>
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Failed
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Refunded
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
          <p className="text-foreground-muted mt-2">
            View and manage payment transactions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-foreground-muted">
            <span className="font-bold text-foreground">{filteredTransactions.length}</span> transactions
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">{formatAmount(stats.total, "USD")}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Completed</p>
              <p className="text-2xl font-bold text-foreground">{formatAmount(stats.completed, "USD")}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Pending</p>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
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
              <p className="text-sm text-foreground-muted">Failed</p>
              <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search transactions..."
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
            <label className="block text-sm font-bold text-foreground mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-surface/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <img
                      src={transaction.user.avatar}
                      alt={transaction.user.name}
                      className="w-12 h-12 rounded-full"
                    />

                    {/* Transaction Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-foreground">{transaction.user.name}</h3>
                        <span className="text-sm text-foreground-muted">•</span>
                        <span className="text-sm text-foreground-muted">{transaction.user.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-foreground-muted">
                        <span>{transaction.description}</span>
                        <span>•</span>
                        <span>Invoice: {transaction.invoiceNumber}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.createdAt)}</span>
                      </div>

                      {/* Payment Details */}
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs bg-surface px-2 py-1 rounded-full">
                          {getPaymentMethodIcon(transaction.paymentMethod)} {transaction.paymentMethod.replace('_', ' ')}
                        </span>
                        <span className="text-xs bg-surface px-2 py-1 rounded-full">
                          {getTransactionTypeIcon(transaction.transactionType)} {transaction.transactionType.replace('_', ' ')}
                        </span>
                        {transaction.metadata?.planName && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                            {transaction.metadata.planName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>

                    {transaction.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowModal(true);
                          }}
                          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-bold"
                        >
                          Review
                        </button>
                      </div>
                    )}

                    {transaction.failureReason && (
                      <div className="text-xs text-red-500 max-w-32 text-right">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Transaction Details</h2>
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
              {/* Transaction Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">Transaction Information</h3>
                  <div className="space-y-2 text-sm">
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
                  <h3 className="text-lg font-bold text-foreground mb-3">User Information</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={selectedTransaction.user.avatar}
                      alt={selectedTransaction.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-bold text-foreground">{selectedTransaction.user.name}</div>
                      <div className="text-sm text-foreground-muted">{selectedTransaction.user.email}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-bold">Payment Method:</span> {selectedTransaction.paymentMethod}</div>
                    <div><span className="font-bold">Type:</span> {selectedTransaction.transactionType}</div>
                    <div><span className="font-bold">Description:</span> {selectedTransaction.description}</div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {selectedTransaction.metadata && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      const reason = prompt("Enter cancellation reason:");
                      if (reason) handleCancelPayment(selectedTransaction.id, reason);
                    }}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold"
                  >
                    Cancel Payment
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Enter refund reason:");
                      if (reason) handleRefundPayment(selectedTransaction.id, reason);
                    }}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-bold"
                  >
                    Refund
                  </button>
                  <button
                    onClick={() => handleConfirmPayment(selectedTransaction.id)}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold"
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
  );
}
