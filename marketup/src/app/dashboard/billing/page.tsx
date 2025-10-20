"use client";
import { useState } from "react";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const billingData = {
    currentPeriod: {
      start: "2024-01-15",
      end: "2024-02-15",
      amount: 29.00,
      status: "active"
    },
    usage: {
      videos: 8,
      storage: 2.4,
      bandwidth: 15.2
    },
    paymentMethod: {
      type: "Visa",
      last4: "4242",
      expiry: "12/26"
    }
  };

  const invoices = [
    {
      id: "INV-001",
      date: "2024-01-15",
      amount: 29.00,
      status: "Paid",
      description: "Pro Plan - Monthly"
    },
    {
      id: "INV-002",
      date: "2023-12-15",
      amount: 29.00,
      status: "Paid",
      description: "Pro Plan - Monthly"
    },
    {
      id: "INV-003",
      date: "2023-11-15",
      amount: 29.00,
      status: "Paid",
      description: "Pro Plan - Monthly"
    }
  ];

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
                <p className="text-2xl font-bold text-foreground">${billingData.currentPeriod.amount}</p>
                <p className="text-sm text-foreground-muted">Pro Plan</p>
              </div>
              
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">Status</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span className="text-lg font-bold text-foreground capitalize">{billingData.currentPeriod.status}</span>
                </div>
                <p className="text-sm text-foreground-muted">Auto-renewal enabled</p>
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
                <p className="text-sm text-foreground-muted">of unlimited</p>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">💾</span>
                  <h3 className="font-semibold text-foreground">Storage Used</h3>
                </div>
                <p className="text-3xl font-bold text-accent">{billingData.usage.storage}GB</p>
                <p className="text-sm text-foreground-muted">of 10GB</p>
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
            {invoices.map((invoice) => (
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
                  <button className="text-accent hover:text-accent-hover text-sm font-medium">
                    Download
                  </button>
                </div>
              </div>
            ))}
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
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
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
                  <span className="text-foreground-muted">8 / Unlimited</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">Storage Used</span>
                  <span className="text-foreground-muted">2.4GB / 10GB</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">Bandwidth This Month</span>
                  <span className="text-foreground-muted">15.2GB / Unlimited</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
