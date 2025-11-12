"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

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
  paymentMethod: "credit_card" | "paypal" | "stripe" | "bank_transfer" | "crypto" | "syriatel_cash" | "zain_cash" | "iban_transfer";
  transactionType: "subscription" | "one_time" | "refund" | "upgrade";
  description: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  subscriptionId?: string;
  invoiceNumber: string;
  receiptUrl?: string;
  metadata?: {
    planName?: string;
    billingCycle?: string;
    discountCode?: string;
    taxAmount?: number;
    receiptUrl?: string;
  };
}

export default function PaymentManagement() {
  const { translations } = useTranslations();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    completedTransactions: 0,
    completedRevenue: 0,
    pendingTransactions: 0,
    pendingRevenue: 0,
    failedTransactions: 0
  });

  // Fetch transactions from API
  const fetchTransactions = async (page: number = currentPage) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          status: filterStatus,
          type: filterType,
          method: filterMethod,
          dateRange,
          sortBy,
        sortOrder,
        page: page.toString(),
        limit: '10'
        });
        
        const response = await fetch(`/api/admin/payments?${params}`, {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.success) {
          setTransactions(data.data.payments);
        setPagination(data.data.pagination);
        setCurrentPage(data.data.pagination.page);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
        } else {
          console.error('Failed to fetch payments:', data.error);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchTransactions(1);
  }, [searchTerm, filterStatus, filterType, filterMethod, dateRange, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      fetchTransactions(page);
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

  const handleConfirmPayment = async (transactionId: string) => {
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          paymentId: transactionId,
          action: 'confirm'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTransactions(currentPage); // Refresh current page
        setShowModal(false);
        setSelectedTransaction(null);
      } else {
        console.error('Failed to confirm payment:', data.error);
        alert(translations.adminPaymentsFailedToConfirmPayment);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert(translations.adminPaymentsErrorConfirmingPayment);
    }
  };

  const handleRefundPayment = async (transactionId: string, reason: string) => {
    try {
      // For now, we'll just update the UI since we don't have a refund action in the API
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
      alert(translations.adminPaymentsRefundFunctionalityWouldBeImplemented);
    } catch (error) {
      console.error('Error processing refund:', error);
      alert(translations.adminPaymentsErrorProcessingRefund);
    }
  };

  const handleCancelPayment = async (transactionId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          paymentId: transactionId,
          action: 'reject',
          reason
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTransactions(currentPage); // Refresh current page
        setShowModal(false);
        setSelectedTransaction(null);
      } else {
        console.error('Failed to cancel payment:', data.error);
        alert(translations.adminPaymentsFailedToCancelPayment);
      }
    } catch (error) {
      console.error('Error cancelling payment:', error);
      alert(translations.adminPaymentsErrorCancellingPayment);
    }
  };

  // Transactions are already filtered by the API
  const filteredTransactions = transactions;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
            {translations.adminPaymentsPending || "Pending"}
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {translations.adminPaymentsCompleted || "Completed"}
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {translations.adminPaymentsFailed || "Failed"}
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            {translations.adminPaymentsRefunded || "Refunded"}
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {translations.adminPaymentsCancelled || "Cancelled"}
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
      case "stripe":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case "paypal":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.367 1.52 1.125 3.544.704 4.79-.246.737-1.036 1.88-2.804 2.396v.1c1.172.193 2.23.739 2.892 1.5 1.165 1.33 1.098 3.097.992 4.032l-.857 7.717a.641.641 0 0 1-.634.74h-3.756c-.115 0-.208-.078-.24-.188l-1.33-6.314c-.052-.247-.28-.425-.53-.425h-1.536c-.115 0-.208-.078-.24-.188l-1.33-6.314c-.052-.247-.28-.425-.53-.425H7.306c-.115 0-.208-.078-.24-.188l-1.33-6.314c-.052-.247-.28-.425-.53-.425H2.47a.641.641 0 0 0-.633.74l1.33 6.314c.032.11.125.188.24.188h4.67z"/>
          </svg>
        );
      case "bank_transfer":
      case "iban_transfer":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case "syriatel_cash":
      case "zain_cash":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case "crypto":
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "BTC") {
      return `${amount} BTC`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(amount);
  };

  if (loading && transactions.length === 0) {
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
              <span>{translations.adminPaymentsPaymentManagement || "Payment Management"}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              {translations.adminPaymentsPaymentManagement || "Payment Management"}
          </h1>
            <p className="text-sm sm:text-base text-white/60">
              {translations.adminPaymentsViewManageTransactions || "View and manage all transactions"}
          </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Revenue */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-green-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500/10 to-green-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTotalRevenue || "Total Revenue"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : formatAmount(stats.totalRevenue, "USD")}
              </p>
            </div>
          </div>

          {/* Completed Revenue */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
              </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminCompletedRevenue || "Completed"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : formatAmount(stats.completedRevenue, "USD")}
              </p>
              <p className="text-xs sm:text-sm text-white/60">{stats.completedTransactions} {translations.adminTransactions || "transactions"}</p>
            </div>
          </div>

          {/* Pending Transactions */}
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
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminPendingTransactions || "Pending"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.pendingTransactions}
              </p>
              <p className="text-xs sm:text-sm text-white/60">{formatAmount(stats.pendingRevenue, "USD")}</p>
            </div>
          </div>

          {/* Failed Transactions */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-red-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500/10 to-red-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminFailedTransactions || "Failed"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.failedTransactions}
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
          
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="relative sm:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
              <input
                type="text"
                      placeholder={translations.adminPaymentsSearchPlaceholder || "Search transactions..."}
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
                    <option value="all">{translations.adminPaymentsAllStatus || "All Status"}</option>
                    <option value="pending">{translations.adminPaymentsPending || "Pending"}</option>
                    <option value="completed">{translations.adminPaymentsCompleted || "Completed"}</option>
                    <option value="failed">{translations.adminPaymentsFailed || "Failed"}</option>
                    <option value="refunded">{translations.adminPaymentsRefunded || "Refunded"}</option>
                    <option value="cancelled">{translations.adminPaymentsCancelled || "Cancelled"}</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                  >
                    <option value="all">{translations.adminPaymentsAllTime || "All Time"}</option>
                    <option value="today">{translations.adminPaymentsToday || "Today"}</option>
                    <option value="week">{translations.adminPaymentsThisWeek || "This Week"}</option>
                    <option value="month">{translations.adminPaymentsThisMonth || "This Month"}</option>
                    <option value="year">{translations.adminPaymentsThisYear || "This Year"}</option>
              </select>
            </div>
          </div>
        </div>

            {/* Transactions Table */}
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
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 lg:py-20">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{translations.adminNoTransactionsFound || "No transactions found"}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-white/60">{translations.adminTryDifferentFilters || "Try different filters or search terms"}</p>
            </div>
          ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/60 border-b-2 border-slate-700/80 sticky top-0 z-20">
                        <tr>
                          <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[200px]">{translations.adminUser || "User"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[150px]">{translations.adminPaymentsPaymentMethod || "Method"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[180px]">{translations.adminPaymentsDate || "Date"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[120px]">{translations.adminAmount || "Amount"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[100px]">{translations.adminPaymentsStatus || "Status"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
              {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-slate-800/60 transition-all duration-200 group border-b border-slate-700/60">
                            <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-w-[200px]">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs sm:text-sm font-bold">
                                    {transaction.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </span>
                                </div>
                      <div className="flex-1 min-w-0">
                                  <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate mb-0.5">{transaction.user.name}</p>
                                  <p className="text-xs sm:text-sm lg:text-base text-white/70 truncate">{transaction.user.email}</p>
                        </div>
                      </div>
                            </td>
                            <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[150px]">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800/40 flex items-center justify-center text-indigo-400">
                                  {getPaymentMethodIcon(transaction.paymentMethod)}
                                </div>
                                <span className="text-xs sm:text-sm lg:text-base text-white/80 capitalize">
                                  {transaction.paymentMethod.replace('_', ' ')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[180px]">
                              <span className="text-xs sm:text-sm lg:text-base text-white/70 block">{formatDate(transaction.createdAt)}</span>
                            </td>
                            <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[120px]">
                              <span className="text-sm sm:text-base lg:text-lg font-bold text-white block">{formatAmount(transaction.amount, transaction.currency)}</span>
                            </td>
                            <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[100px]">
                              <div className="flex flex-col items-start gap-2">
                          {getStatusBadge(transaction.status)}
                        {transaction.status === "pending" && (
                                  <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirmPayment(transaction.id)}
                                      className="px-2 sm:px-3 py-1 sm:py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs sm:text-sm font-semibold rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all duration-300"
                            >
                                      {translations.adminPaymentsConfirm || "Confirm"}
                            </button>
                            <button
                              onClick={() => {
                                        const reason = prompt(translations.adminPaymentsEnterCancellationReason || "Enter cancellation reason:");
                                if (reason) handleCancelPayment(transaction.id, reason);
                              }}
                                      className="px-2 sm:px-3 py-1 sm:py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs sm:text-sm font-semibold rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                            >
                                      {translations.adminPaymentsCancel || "Cancel"}
                            </button>
                                  </div>
                        )}
                        {transaction.status === "completed" && (
                          <button
                            onClick={() => {
                                      const reason = prompt(translations.adminPaymentsEnterRefundReason || "Enter refund reason:");
                              if (reason) handleRefundPayment(transaction.id, reason);
                            }}
                                    className="px-2 sm:px-3 py-1 sm:py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                          >
                                    {translations.adminPaymentsRefund || "Refund"}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowModal(true);
                          }}
                                  className="px-2 sm:px-3 py-1 sm:py-1 bg-slate-800/40 hover:bg-slate-800/60 text-white text-xs sm:text-sm font-semibold rounded-lg border border-slate-700/60 hover:border-slate-600/60 transition-all duration-300"
                        >
                                  {translations.adminPaymentsView || "View"}
                        </button>
                      </div>
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
                  {translations.adminShowingTransactions || "Showing"} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {translations.adminOfTransactions || "of"} {pagination.total} {translations.adminTransactions || "transactions"}
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

        {/* Transaction Details Modal */}
        {showModal && selectedTransaction && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 sm:p-6 lg:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700/60">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.adminPaymentsTransactionDetails || "Transaction Details"}</h2>
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
                {/* Transaction Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminPaymentsTransactionInformation || "Transaction Information"}</h3>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <div><span className="font-bold text-white/60">ID:</span> <span className="text-white">{selectedTransaction.id}</span></div>
                        <div><span className="font-bold text-white/60">{translations.adminPaymentsInvoice || "Invoice"}:</span> <span className="text-white">{selectedTransaction.invoiceNumber}</span></div>
                        <div><span className="font-bold text-white/60">Amount:</span> <span className="text-white">{formatAmount(selectedTransaction.amount, selectedTransaction.currency)}</span></div>
                        <div><span className="font-bold text-white/60">{translations.adminPaymentsStatus || "Status"}:</span> <span className="text-white">{getStatusBadge(selectedTransaction.status)}</span></div>
                        <div><span className="font-bold text-white/60">Created:</span> <span className="text-white">{formatDate(selectedTransaction.createdAt)}</span></div>
                      {selectedTransaction.processedAt && (
                          <div><span className="font-bold text-white/60">Processed:</span> <span className="text-white">{formatDate(selectedTransaction.processedAt)}</span></div>
                      )}
                    </div>
                  </div>

                    <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminPaymentsUserInformation || "User Information"}</h3>
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {selectedTransaction.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                  <div>
                          <div className="text-base sm:text-lg font-bold text-white">{selectedTransaction.user.name}</div>
                          <div className="text-sm sm:text-base text-white/60">{selectedTransaction.user.email}</div>
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <div><span className="font-bold text-white/60">Payment Method:</span> <span className="text-white capitalize">{selectedTransaction.paymentMethod.replace('_', ' ')}</span></div>
                        <div><span className="font-bold text-white/60">{translations.adminPaymentsType || "Type"}:</span> <span className="text-white capitalize">{selectedTransaction.transactionType.replace('_', ' ')}</span></div>
                        <div><span className="font-bold text-white/60">Description:</span> <span className="text-white">{selectedTransaction.description}</span></div>
                    </div>
                  </div>
                </div>

                {/* Receipt */}
                {(selectedTransaction.receiptUrl || selectedTransaction.metadata?.receiptUrl) && (
                    <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Payment Receipt</h3>
                      <a
                        href={selectedTransaction.receiptUrl || selectedTransaction.metadata?.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {(selectedTransaction.receiptUrl || selectedTransaction.metadata?.receiptUrl)?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img
                            src={selectedTransaction.receiptUrl || selectedTransaction.metadata?.receiptUrl}
                            alt="Payment receipt"
                            className="max-w-full h-auto rounded-lg border border-slate-700/60 cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <div className="p-6 bg-slate-800/40 rounded-lg border border-slate-700/60 text-center hover:bg-slate-800/60 transition-colors">
                            <svg className="w-12 h-12 mx-auto mb-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm sm:text-base font-bold text-white mb-1">View Receipt</p>
                            <p className="text-xs sm:text-sm text-white/60">Click to open receipt file</p>
                          </div>
                        )}
                      </a>
                  </div>
                )}

                {/* Metadata */}
                {selectedTransaction.metadata && (
                    <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminPaymentsAdditionalInformation || "Additional Information"}</h3>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      {selectedTransaction.metadata.planName && (
                          <div><span className="font-bold text-white/60">{translations.adminPaymentsPlan || "Plan"}:</span> <span className="text-white">{selectedTransaction.metadata.planName}</span></div>
                      )}
                      {selectedTransaction.metadata.billingCycle && (
                          <div><span className="font-bold text-white/60">{translations.adminPaymentsBilling || "Billing"}:</span> <span className="text-white">{selectedTransaction.metadata.billingCycle}</span></div>
                      )}
                      {selectedTransaction.metadata.discountCode && (
                          <div><span className="font-bold text-white/60">{translations.adminPaymentsDiscount || "Discount"}:</span> <span className="text-white">{selectedTransaction.metadata.discountCode}</span></div>
                      )}
                      {selectedTransaction.metadata.taxAmount && (
                          <div><span className="font-bold text-white/60">{translations.adminPaymentsTax || "Tax"}:</span> <span className="text-white">{formatAmount(selectedTransaction.metadata.taxAmount, "USD")}</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedTransaction.status === "pending" && (
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-700/60">
                    <button
                      onClick={() => {
                          const reason = prompt(translations.adminPaymentsEnterCancellationReason || "Enter cancellation reason:");
                        if (reason) handleCancelPayment(selectedTransaction.id, reason);
                      }}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg sm:rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300 text-xs sm:text-sm font-bold hover:scale-105"
                      >
                        {translations.adminPaymentsCancelPayment || "Cancel Payment"}
                    </button>
                    <button
                      onClick={() => handleConfirmPayment(selectedTransaction.id)}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-bold hover:scale-105 shadow-lg shadow-green-500/20"
                    >
                        {translations.adminPaymentsConfirmPayment || "Confirm Payment"}
                    </button>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
