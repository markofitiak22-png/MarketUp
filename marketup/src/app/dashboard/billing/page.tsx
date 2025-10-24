"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

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
  const { translations } = useTranslations();
  const [activeTab, setActiveTab] = useState("overview");
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-elevated rounded-3xl p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-surface rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-32 bg-surface rounded"></div>
                  <div className="h-32 bg-surface rounded"></div>
                  <div className="h-32 bg-surface rounded"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-elevated rounded-3xl p-8 text-center">
              <div className="text-6xl mb-6">⚠️</div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{translations.billingErrorLoadingData}</h2>
              <p className="text-lg text-foreground-muted mb-6">{translations.billingPleaseTryRefreshing}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary px-8 py-4 text-lg"
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
    { id: "overview", name: translations.billingOverview, icon: "📊" },
    { id: "invoices", name: translations.billingInvoices, icon: "🧾" },
    { id: "payment", name: translations.billingPaymentMethods, icon: "💳" },
    { id: "usage", name: translations.billingUsage, icon: "📈" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent mb-6">
              {translations.billingInvoices}
            </h1>
            <p className="text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
              {translations.billingManageBillingInformation}
            </p>
          </div>

          {/* Tabs */}
          <div className="glass-elevated rounded-3xl p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20">
            <div className="flex flex-wrap gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-105 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-xl"
                      : "text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
                  }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Current Billing Period */}
              <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
                <h2 className="text-4xl font-bold text-foreground mb-8">{translations.billingCurrentBillingPeriod}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                    <h3 className="text-xl font-bold text-foreground mb-4">{translations.billingPeriod}</h3>
                    <p className="text-3xl font-bold text-foreground mb-2">
                      {billingData.currentPeriod.start} - {billingData.currentPeriod.end}
                    </p>
                    <p className="text-lg text-foreground-muted">{translations.billingCurrentBillingCycle}</p>
                  </div>
                  
                  <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                    <h3 className="text-xl font-bold text-foreground mb-4">{translations.billingAmount}</h3>
                    <p className="text-3xl font-bold text-foreground mb-2">
                      {billingData.currentPeriod.amount === 0 ? 'Free' : `$${billingData.currentPeriod.amount}`}
                    </p>
                    <p className="text-lg text-foreground-muted">{billingData.currentPeriod.planName}</p>
                  </div>
                  
                  <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                    <h3 className="text-xl font-bold text-foreground mb-4">{translations.billingStatus}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`w-3 h-3 rounded-full ${
                        billingData.currentPeriod.status === 'active' ? 'bg-success' : 'bg-warning'
                      }`}></span>
                      <span className="text-2xl font-bold text-foreground capitalize">{billingData.currentPeriod.status}</span>
                    </div>
                    <p className="text-lg text-foreground-muted">
                      {billingData.currentPeriod.amount === 0 ? translations.billingFreePlan : translations.billingAutoRenewalEnabled}
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage Summary */}
              <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
                <h2 className="text-4xl font-bold text-foreground mb-8">{translations.billingUsageThisMonth}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl">🎥</span>
                      <h3 className="text-xl font-bold text-foreground">{translations.billingVideosCreated}</h3>
                    </div>
                    <p className="text-4xl font-bold text-accent mb-3">{billingData.usage.videos}</p>
                    <p className="text-lg text-foreground-muted">
                      {translations.billingOf} {billingData.usage.videoLimit === 'unlimited' ? translations.billingUnlimited : billingData.usage.videoLimit}
                    </p>
                  </div>
                  
                  <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl">💾</span>
                      <h3 className="text-xl font-bold text-foreground">{translations.billingStorageUsed}</h3>
                    </div>
                    <p className="text-4xl font-bold text-accent mb-3">{billingData.usage.storage}GB</p>
                    <p className="text-lg text-foreground-muted mb-4">{translations.billingOf} {billingData.usage.storageLimit}GB</p>
                    <div className="w-full bg-border rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-accent to-accent-2 h-4 rounded-full transition-all duration-500 shadow-lg"
                        style={{ 
                          width: `${Math.min(100, (billingData.usage.storage / billingData.usage.storageLimit) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl">🌐</span>
                      <h3 className="text-xl font-bold text-foreground">{translations.billingBandwidth}</h3>
                    </div>
                    <p className="text-4xl font-bold text-accent mb-3">{billingData.usage.bandwidth}GB</p>
                    <p className="text-lg text-foreground-muted">{translations.billingThisMonth}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "invoices" && (
            <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
              <h2 className="text-4xl font-bold text-foreground mb-8">{translations.billingInvoiceHistory}</h2>
              
              <div className="space-y-6">
                {billingData.invoices.length > 0 ? (
                  billingData.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-8 glass rounded-3xl hover:scale-[1.02] transition-all duration-300 group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform">
                        🧾
                      </div>
                      <div>
                        <p className="text-xl font-bold text-foreground">{invoice.description}</p>
                        <p className="text-lg text-foreground-muted">Invoice #{invoice.id} • {invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-bold text-foreground">${invoice.amount}</span>
                      <span className="px-4 py-2 rounded-2xl text-lg font-bold bg-success/20 text-success border border-success/30">
                        {invoice.status}
                      </span>
                      <button 
                        className="text-accent hover:text-accent-hover text-xl font-bold hover:scale-105 transition-all duration-300"
                        onClick={() => window.open(invoice.downloadUrl, '_blank')}
                      >
                        {translations.billingDownload}
                      </button>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="text-9xl mb-8">🧾</div>
                    <h3 className="text-3xl font-bold text-foreground mb-6">{translations.billingNoInvoicesYet}</h3>
                    <p className="text-xl text-foreground-muted">{translations.billingInvoiceHistoryWillAppear}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-bold text-foreground">{translations.billingPaymentMethods}</h2>
                <button className="btn-primary px-8 py-4 text-lg font-bold hover:scale-105 transition-all duration-300">
                  {translations.billingAddPaymentMethod}
                </button>
              </div>
              
              <div className="space-y-6">
                {billingData.paymentMethod ? (
                  <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-12 rounded-2xl flex items-center justify-center shadow-xl ${
                          billingData.paymentMethod.brand === 'visa' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          billingData.paymentMethod.brand === 'mastercard' ? 'bg-gradient-to-r from-red-500 to-yellow-500' :
                          'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                          <span className="text-white text-lg font-bold">
                            {billingData.paymentMethod.brand.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">**** **** **** {billingData.paymentMethod.last4}</p>
                          <p className="text-lg text-foreground-muted">Expires {billingData.paymentMethod.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-2 rounded-2xl text-lg font-bold bg-success/20 text-success border border-success/30">
                          {translations.billingDefault}
                        </span>
                        <button className="text-accent hover:text-accent-hover text-xl font-bold hover:scale-105 transition-all duration-300">
                          {translations.billingEdit}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-9xl mb-8">💳</div>
                    <h3 className="text-3xl font-bold text-foreground mb-6">{translations.billingNoPaymentMethod}</h3>
                    <p className="text-xl text-foreground-muted mb-8">{translations.billingAddPaymentMethodToManage}</p>
                    <button className="btn-primary px-10 py-5 text-xl font-bold hover:scale-105 transition-all duration-300">
                      {translations.billingAddPaymentMethod}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-8">
              <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
                <h2 className="text-4xl font-bold text-foreground mb-8">{translations.billingDetailedUsage}</h2>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-foreground">{translations.billingVideosCreated}</span>
                      <span className="text-lg text-foreground-muted">
                        {billingData.usage.videos} / {billingData.usage.videoLimit === 'unlimited' ? translations.billingUnlimited : billingData.usage.videoLimit}
                      </span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-accent to-accent-2 h-4 rounded-full transition-all duration-500 shadow-lg" 
                        style={{ 
                          width: billingData.usage.videoLimit === 'unlimited' ? '5%' : 
                                 `${Math.min(100, (billingData.usage.videos / Number(billingData.usage.videoLimit)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-foreground">{translations.billingStorageUsed}</span>
                      <span className="text-lg text-foreground-muted">{billingData.usage.storage}GB / {billingData.usage.storageLimit}GB</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-accent to-accent-2 h-4 rounded-full transition-all duration-500 shadow-lg" 
                        style={{ 
                          width: `${Math.min(100, (billingData.usage.storage / billingData.usage.storageLimit) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-foreground">{translations.billingBandwidthThisMonth}</span>
                      <span className="text-lg text-foreground-muted">{billingData.usage.bandwidth}GB / {translations.billingUnlimited}</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-accent to-accent-2 h-4 rounded-full transition-all duration-500 shadow-lg" 
                        style={{ width: '5%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
