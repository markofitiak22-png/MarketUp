"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import Toast from "@/components/ui/Toast";

interface BillingData {
  currentPeriod: {
    start: string;
    end: string;
    amount: number;
    status: string;
    planName: string;
  };
  usage: {
    videos: number;
    storage: number;
    bandwidth: number;
    totalVideos: number;
    storageLimit: number;
    videoLimit: string | number;
  };
  paymentMethod: {
    type: string;
    last4: string;
    expiry: string;
    brand: string;
  } | null;
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    description: string;
    downloadUrl: string;
  }>;
}

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { translations } = useTranslations();
  const [activeTab, setActiveTab] = useState("overview");
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  // Fetch billing data
  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/billing');
      const data = await response.json();
      
      if (data.success) {
        setBillingData(data.data);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  // Handle payment method added/updated/canceled from Stripe redirect
  useEffect(() => {
    if (searchParams.get('payment_method_added') === 'true') {
      setToast({
        isOpen: true,
        message: translations.billingPaymentMethodAddedSuccessfully || 'Payment method added successfully!',
        type: 'success',
      });
      // Refresh billing data
      fetchBillingData();
      // Remove query param
      router.replace('/dashboard/billing');
    } else if (searchParams.get('payment_method_updated') === 'true') {
      setToast({
        isOpen: true,
        message: translations.billingPaymentMethodUpdatedSuccessfully || 'Payment method updated successfully!',
        type: 'success',
      });
      // Refresh billing data
      fetchBillingData();
      // Remove query param
      router.replace('/dashboard/billing');
    } else if (searchParams.get('payment_method_canceled') === 'true') {
      setToast({
        isOpen: true,
        message: translations.billingPaymentMethodAddCanceled || 'Payment method addition was canceled.',
        type: 'info',
      });
      // Remove query param
      router.replace('/dashboard/billing');
    }
  }, [searchParams, router, translations]);

  const handleAddPaymentMethod = async (isEdit: boolean = false) => {
    try {
      setIsAddingPaymentMethod(true);
      const response = await fetch('/api/payments/stripe/setup-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isEdit ? 'update_payment_method' : 'add_payment_method',
        }),
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setToast({
          isOpen: true,
          message: data.error || translations.billingErrorAddingPaymentMethod || 'Failed to add payment method. Please try again.',
          type: 'error',
        });
        setIsAddingPaymentMethod(false);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      setToast({
        isOpen: true,
        message: translations.billingErrorAddingPaymentMethod || 'An error occurred. Please try again.',
        type: 'error',
      });
      setIsAddingPaymentMethod(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
        {/* Shared background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse">
                <div className="h-6 sm:h-8 bg-slate-800/40 rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  <div className="h-32 sm:h-40 bg-slate-800/40 rounded"></div>
                  <div className="h-32 sm:h-40 bg-slate-800/40 rounded"></div>
                  <div className="h-32 sm:h-40 bg-slate-800/40 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
        {/* Shared background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{translations.billingErrorLoadingData}</h2>
              <p className="text-sm sm:text-base text-white/60 mb-4 sm:mb-6">{translations.billingPleaseTryRefreshing}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                {translations.billingRefreshPage}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: translations.billingOverview, icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: "invoices", name: translations.billingInvoices, icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: "payment", name: translations.billingPaymentMethods, icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { id: "usage", name: translations.billingUsage, icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )}
  ];

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
              <span>Billing</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
          
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              {translations.billingInvoices}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/60">{translations.billingManageBillingInformation}</p>
          </div>
          </div>

          {/* Tabs */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-slate-800/40 hover:bg-slate-800/60 text-white/60 hover:text-white border border-slate-700/60"
                  }`}
                >
                {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
          <>
            {/* Main Stats - Large Cards in Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              {/* Current Plan - Large Card */}
              <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.billingCurrentBillingPeriod}</h3>
                        <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5 sm:mt-1">
                          {billingData.currentPeriod.planName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold ${
                        billingData.currentPeriod.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {billingData.currentPeriod.status}
                      </span>
                      {billingData.currentPeriod.amount > 0 && (
                        <span className="text-xs sm:text-sm font-semibold text-white/60">
                          ${billingData.currentPeriod.amount}/{translations.billingMonth || "month"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">
                      {billingData.currentPeriod.start} - {billingData.currentPeriod.end}
                    </span>
                  </div>
                </div>
                  </div>
                  
              {/* Amount & Status - Compact Card */}
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.billingAmount}</h3>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {billingData.currentPeriod.amount === 0 ? 'Free' : `$${billingData.currentPeriod.amount}`}
                    </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <p className="text-[10px] sm:text-xs text-white/50 mb-1.5 sm:mb-2">{translations.billingAutoRenewalEnabled || "Auto-renewal enabled"}</p>
                    <div className="w-full bg-slate-800/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              {/* Left Column - Usage Stats Grid */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">{translations.billingUsageThisMonth}</h2>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {/* Videos */}
                    <div className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 group hover:border-indigo-500/40 transition-all duration-300">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">{translations.billingVideosCreated}</h3>
                      </div>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {billingData.usage.videos}
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">{translations.billingOf} {billingData.usage.videoLimit === 'unlimited' ? translations.billingUnlimited : billingData.usage.videoLimit}</p>
                    </div>
                    
                    {/* Storage */}
                    <div className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 group hover:border-purple-500/40 transition-all duration-300">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                          </svg>
                        </div>
                        <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">{translations.billingStorageUsed}</h3>
                      </div>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {typeof billingData.usage.storage === 'number' ? parseFloat(billingData.usage.storage.toFixed(2)) : billingData.usage.storage}GB
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">{translations.billingOf} {billingData.usage.storageLimit}GB</p>
                  </div>
                  
                    {/* Bandwidth */}
                    <div className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 group hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">{translations.billingBandwidth}</h3>
                      </div>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {typeof billingData.usage.bandwidth === 'number' ? parseFloat(billingData.usage.bandwidth.toFixed(2)) : billingData.usage.bandwidth}GB
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">{translations.billingThisMonth}</p>
                    </div>
                    
                    {/* Total Videos */}
                    <div className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 group hover:border-green-500/40 transition-all duration-300">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">{translations.billingTotalVideos || "Total Videos"}</h3>
                      </div>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        {billingData.usage.totalVideos || 0}
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">{translations.billingAllTime || "All time"}</p>
                    </div>
                  </div>
                    </div>
                  </div>
                  
              {/* Right Column - Payment Method */}
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
                  <div className="relative z-10">
                    <h3 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4">{translations.billingPaymentMethods}</h3>
                    {billingData.paymentMethod ? (
                      <div className="space-y-3">
                        <div className={`w-full h-12 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg ${
                          billingData.paymentMethod.brand === 'visa' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          billingData.paymentMethod.brand === 'mastercard' ? 'bg-gradient-to-r from-red-500 to-yellow-500' :
                          'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                          <span className="text-white text-xs sm:text-sm font-bold">
                            {billingData.paymentMethod.brand.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-white">**** **** **** {billingData.paymentMethod.last4}</p>
                          <p className="text-[10px] sm:text-xs text-white/60">Expires {billingData.paymentMethod.expiry}</p>
                        </div>
                        <span className="inline-block px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                          {translations.billingDefault}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center py-4 sm:py-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">{translations.billingNoPaymentMethod}</p>
                        <button 
                          onClick={() => handleAddPaymentMethod(false)}
                          disabled={isAddingPaymentMethod}
                          className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isAddingPaymentMethod ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Loading...</span>
                            </>
                          ) : (
                            translations.billingAddPaymentMethod
                          )}
                        </button>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
          )}

          {activeTab === "invoices" && (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">{translations.billingInvoiceHistory}</h2>
              
            <div className="space-y-2 sm:space-y-3">
                {billingData.invoices.length > 0 ? (
                  billingData.invoices.map((invoice) => (
                <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      </div>
                      <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{invoice.description}</p>
                      <p className="text-[10px] sm:text-xs text-white/60">Invoice #{invoice.id} • {invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-semibold text-white">${invoice.amount}</span>
                    <span className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                        {invoice.status}
                      </span>
                      <button 
                      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-800/60 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 text-[10px] sm:text-xs font-semibold transition-all duration-300 border border-slate-700/60 hover:border-indigo-500/40 flex items-center gap-1.5"
                        onClick={() => {
                          const newWindow = window.open(invoice.downloadUrl, '_blank');
                          if (newWindow) {
                            newWindow.onload = () => {
                              setTimeout(() => {
                                newWindow.print();
                              }, 500);
                            };
                          }
                        }}
                      >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {translations.billingDownload}
                      </button>
                    </div>
                  </div>
                  ))
                ) : (
                <div className="text-center py-6 sm:py-8 lg:py-12">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">{translations.billingNoInvoicesYet}</h3>
                  <p className="text-xs sm:text-sm text-white/60">{translations.billingInvoiceHistoryWillAppear}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "payment" && (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.billingPaymentMethods}</h2>
              <button 
                onClick={() => handleAddPaymentMethod(false)}
                disabled={isAddingPaymentMethod}
                className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAddingPaymentMethod ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                  </>
                ) : (
                  translations.billingAddPaymentMethod
                )}
              </button>
              </div>
              
            <div className="space-y-3 sm:space-y-4">
                {billingData.paymentMethod ? (
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-indigo-500/40 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                      <div className={`w-12 h-8 sm:w-16 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                          billingData.paymentMethod.brand === 'visa' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          billingData.paymentMethod.brand === 'mastercard' ? 'bg-gradient-to-r from-red-500 to-yellow-500' :
                          'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                        <span className="text-white text-xs sm:text-sm lg:text-base font-bold">
                            {billingData.paymentMethod.brand.toUpperCase()}
                          </span>
                        </div>
                        <div>
                        <p className="text-sm sm:text-base lg:text-lg font-bold text-white">**** **** **** {billingData.paymentMethod.last4}</p>
                        <p className="text-xs sm:text-sm text-white/60">Expires {billingData.paymentMethod.expiry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      <span className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                          {translations.billingDefault}
                        </span>
                      <button 
                        onClick={() => handleAddPaymentMethod(true)}
                        disabled={isAddingPaymentMethod}
                        className="text-indigo-400 hover:text-indigo-300 text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isAddingPaymentMethod ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-xs">Loading...</span>
                          </>
                        ) : (
                          translations.billingEdit
                        )}
                      </button>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="text-center py-6 sm:py-8 lg:py-12">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">{translations.billingNoPaymentMethod}</h3>
                  <p className="text-xs sm:text-sm text-white/60 mb-4 sm:mb-6">{translations.billingAddPaymentMethodToManage}</p>
                  <button 
                    onClick={() => handleAddPaymentMethod(false)}
                    disabled={isAddingPaymentMethod}
                    className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                  >
                    {isAddingPaymentMethod ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading...</span>
                      </>
                    ) : (
                      translations.billingAddPaymentMethod
                    )}
                  </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "usage" && (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">{translations.billingDetailedUsage}</h2>
                
            <div className="space-y-4 sm:space-y-6">
                  <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.billingVideosCreated}</span>
                  <span className="text-xs sm:text-sm text-white/60">
                        {billingData.usage.videos} / {billingData.usage.videoLimit === 'unlimited' ? translations.billingUnlimited : billingData.usage.videoLimit}
                      </span>
                    </div>
                <div className="w-full bg-slate-800/60 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: billingData.usage.videoLimit === 'unlimited' ? '5%' : 
                                 `${Math.min(100, (billingData.usage.videos / Number(billingData.usage.videoLimit)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.billingStorageUsed}</span>
                  <span className="text-xs sm:text-sm text-white/60">{typeof billingData.usage.storage === 'number' ? parseFloat(billingData.usage.storage.toFixed(2)) : billingData.usage.storage}GB / {billingData.usage.storageLimit}GB</span>
                    </div>
                <div className="w-full bg-slate-800/60 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${Math.min(100, (billingData.usage.storage / billingData.usage.storageLimit) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.billingBandwidthThisMonth}</span>
                  <span className="text-xs sm:text-sm text-white/60">{typeof billingData.usage.bandwidth === 'number' ? parseFloat(billingData.usage.bandwidth.toFixed(2)) : billingData.usage.bandwidth}GB / {translations.billingUnlimited}</span>
                    </div>
                <div className="w-full bg-slate-800/60 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: '5%' }}
                      ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
        message={toast.message}
        type={toast.type}
        duration={5000}
      />
    </div>
  );
}
