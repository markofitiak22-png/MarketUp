"use client";
import { useState, useEffect } from "react";

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
      <div className="space-y-6">
        <div className="glass-elevated rounded-2xl p-8">
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
    );
  }

  if (!billingData) {
    return (
      <div className="space-y-6">
        <div className="glass-elevated rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Error loading billing data</h2>
          <p className="text-foreground-muted">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "invoices", name: "Invoices", icon: "🧾" },
    { id: "payment", name: "Payment Methods", icon: "💳" },
    { id: "usage", name: "Usage", icon: "📈" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-elevated rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Billing & Invoices</h1>
        <p className="text-foreground-muted">Manage your billing information and payment methods</p>
      </div>

      {/* Tabs */}
      <div className="glass-elevated rounded-2xl p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-accent text-white"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Current Billing Period */}
          <div className="glass-elevated rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Current Billing Period</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">Period</h3>
                <p className="text-2xl font-bold text-foreground">
                  {billingData.currentPeriod.start} - {billingData.currentPeriod.end}
                </p>
                <p className="text-sm text-foreground-muted">Current billing cycle</p>
              </div>
              
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">Amount</h3>
                <p className="text-2xl font-bold text-foreground">
                  {billingData.currentPeriod.amount === 0 ? 'Free' : `$${billingData.currentPeriod.amount}`}
                </p>
                <p className="text-sm text-foreground-muted">{billingData.currentPeriod.planName}</p>
              </div>
              
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">Status</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    billingData.currentPeriod.status === 'active' ? 'bg-success' : 'bg-warning'
                  }`}></span>
                  <span className="text-lg font-bold text-foreground capitalize">{billingData.currentPeriod.status}</span>
                </div>
                <p className="text-sm text-foreground-muted">
                  {billingData.currentPeriod.amount === 0 ? 'Free plan' : 'Auto-renewal enabled'}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Summary */}
          <div className="glass-elevated rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Usage This Month</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎥</span>
                  <h3 className="font-semibold text-foreground">Videos Created</h3>
                </div>
                <p className="text-3xl font-bold text-accent">{billingData.usage.videos}</p>
                <p className="text-sm text-foreground-muted">
                  of {billingData.usage.videoLimit === 'unlimited' ? 'unlimited' : billingData.usage.videoLimit}
                </p>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">💾</span>
                  <h3 className="font-semibold text-foreground">Storage Used</h3>
                </div>
                <p className="text-3xl font-bold text-accent">{billingData.usage.storage}GB</p>
                <p className="text-sm text-foreground-muted">of {billingData.usage.storageLimit}GB</p>
                <div className="mt-2">
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (billingData.usage.storage / billingData.usage.storageLimit) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌐</span>
                  <h3 className="font-semibold text-foreground">Bandwidth</h3>
                </div>
                <p className="text-3xl font-bold text-accent">{billingData.usage.bandwidth}GB</p>
                <p className="text-sm text-foreground-muted">this month</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="glass-elevated rounded-2xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Invoice History</h2>
          
          <div className="space-y-4">
            {billingData.invoices.length > 0 ? (
              billingData.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 glass rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                    <span className="text-lg">🧾</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{invoice.description}</p>
                    <p className="text-sm text-foreground-muted">Invoice #{invoice.id} • {invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-foreground">${invoice.amount}</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                    {invoice.status}
                  </span>
                  <button 
                    className="text-accent hover:text-accent-hover text-sm font-medium"
                    onClick={() => window.open(invoice.downloadUrl, '_blank')}
                  >
                    Download
                  </button>
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🧾</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No invoices yet</h3>
                <p className="text-foreground-muted">Your invoice history will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="glass-elevated rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Payment Methods</h2>
            <button className="btn-primary px-4 py-2">
              Add Payment Method
            </button>
          </div>
          
          <div className="space-y-4">
            {billingData.paymentMethod ? (
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-8 rounded flex items-center justify-center ${
                      billingData.paymentMethod.brand === 'visa' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      billingData.paymentMethod.brand === 'mastercard' ? 'bg-gradient-to-r from-red-500 to-yellow-500' :
                      'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      <span className="text-white text-xs font-bold">
                        {billingData.paymentMethod.brand.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">**** **** **** {billingData.paymentMethod.last4}</p>
                      <p className="text-sm text-foreground-muted">Expires {billingData.paymentMethod.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                      Default
                    </span>
                    <button className="text-accent hover:text-accent-hover text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No payment method</h3>
                <p className="text-foreground-muted mb-4">Add a payment method to manage your subscription</p>
                <button className="btn-primary px-6 py-3">
                  Add Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "usage" && (
        <div className="space-y-6">
          <div className="glass-elevated rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Detailed Usage</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">Videos Created</span>
                  <span className="text-foreground-muted">
                    {billingData.usage.videos} / {billingData.usage.videoLimit === 'unlimited' ? 'Unlimited' : billingData.usage.videoLimit}
                  </span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: billingData.usage.videoLimit === 'unlimited' ? '5%' : 
                             `${Math.min(100, (billingData.usage.videos / Number(billingData.usage.videoLimit)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">Storage Used</span>
                  <span className="text-foreground-muted">{billingData.usage.storage}GB / {billingData.usage.storageLimit}GB</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min(100, (billingData.usage.storage / billingData.usage.storageLimit) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">Bandwidth This Month</span>
                  <span className="text-foreground-muted">{billingData.usage.bandwidth}GB / Unlimited</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300" 
                    style={{ width: '5%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
