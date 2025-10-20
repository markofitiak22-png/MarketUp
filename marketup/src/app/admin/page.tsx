"use client";
import { useState, useEffect } from "react";

interface DashboardMetrics {
  totalUsers: number;
  totalRevenue: number;
  totalVideos: number;
  activeUsers: number;
  revenueGrowth: number;
  userGrowth: number;
  videoGrowth: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalRevenue: 0,
    totalVideos: 0,
    activeUsers: 0,
    revenueGrowth: 0,
    userGrowth: 0,
    videoGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchMetrics = async () => {
      setLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        totalUsers: 1247,
        totalRevenue: 45680,
        totalVideos: 3421,
        activeUsers: 892,
        revenueGrowth: 12.5,
        userGrowth: 8.3,
        videoGrowth: 15.7,
      });
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    growth: number; 
    icon: React.ReactNode; 
    color: string;
  }) => (
    <div className="glass-elevated rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <div className={`text-sm font-bold ${growth >= 0 ? 'text-success' : 'text-error'}`}>
          {growth >= 0 ? '+' : ''}{growth}%
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground mb-1">
          {loading ? (
            <div className="w-16 h-8 bg-surface-elevated rounded animate-pulse"></div>
          ) : (
            value
          )}
        </div>
        <p className="text-sm text-foreground-muted">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground-muted mt-2">Overview of your platform metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm font-medium text-foreground hover:bg-surface transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={loading ? "..." : formatNumber(metrics.totalUsers)}
          growth={metrics.userGrowth}
          color="bg-accent/10"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />

        <StatCard
          title="Total Revenue"
          value={loading ? "..." : formatCurrency(metrics.totalRevenue)}
          growth={metrics.revenueGrowth}
          color="bg-success/10"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
        />

        <StatCard
          title="Videos Created"
          value={loading ? "..." : formatNumber(metrics.totalVideos)}
          growth={metrics.videoGrowth}
          color="bg-warning/10"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          }
        />

        <StatCard
          title="Active Users"
          value={loading ? "..." : formatNumber(metrics.activeUsers)}
          growth={5.2}
          color="bg-accent-2/10"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-foreground-muted">Revenue</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground-muted mb-4">
                <path d="M3 3v18h18"/>
                <path d="M18.5 8.5l-3 3-2-2-4 4"/>
              </svg>
              <p className="text-foreground-muted">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="glass-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">User Activity</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-foreground-muted">Active Users</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground-muted mb-4">
                <path d="M3 3v18h18"/>
                <path d="M18.5 8.5l-3 3-2-2-4 4"/>
              </svg>
              <p className="text-foreground-muted">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-elevated rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-surface-elevated rounded-lg">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">New user registered</p>
              <p className="text-xs text-foreground-muted">john.doe@example.com joined the platform</p>
            </div>
            <span className="text-xs text-foreground-muted">2 minutes ago</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-surface-elevated rounded-lg">
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Video processing completed</p>
              <p className="text-xs text-foreground-muted">"Marketing Campaign 2024" is ready</p>
            </div>
            <span className="text-xs text-foreground-muted">5 minutes ago</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-surface-elevated rounded-lg">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Payment received</p>
              <p className="text-xs text-foreground-muted">$299.00 from Premium subscription</p>
            </div>
            <span className="text-xs text-foreground-muted">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
