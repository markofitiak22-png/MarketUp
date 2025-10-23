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

interface RecentActivity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  status?: string;
}

interface AdminData {
  metrics: DashboardMetrics;
  recentActivity: RecentActivity[];
  charts: {
    revenue: {
      labels: string[];
      data: number[];
    };
    users: {
      labels: string[];
      data: number[];
    };
  };
}

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin dashboard data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching admin data...');
      const response = await fetch('/api/admin/dashboard');
      console.log('Admin API response status:', response.status);
      
      const data = await response.json();
      console.log('Admin API response data:', data);
      
      if (data.success) {
        setAdminData(data.data);
      } else {
        console.error('Admin API returned error:', data.error);
        setError(data.error || 'Failed to fetch admin data');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
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
    <div className="glass-elevated rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`text-lg font-bold ${growth >= 0 ? 'text-success' : 'text-error'}`}>
          {growth >= 0 ? '+' : ''}{growth}%
        </div>
      </div>
      <div>
        <div className="text-4xl font-bold text-foreground mb-2">
          {loading ? (
            <div className="w-24 h-10 bg-surface-elevated rounded animate-pulse"></div>
          ) : (
            value
          )}
        </div>
        <p className="text-lg text-foreground-muted">{title}</p>
      </div>
    </div>
  );

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
                <div className="h-4 bg-surface rounded w-2/3"></div>
              </div>
            </div>
            <div className="glass-elevated rounded-2xl p-6 mt-8">
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-surface rounded"></div>
                <div className="h-16 bg-surface rounded"></div>
                <div className="h-16 bg-surface rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <div className="glass-elevated rounded-3xl p-10 text-center">
              <div className="text-6xl mb-6">⚠️</div>
              <h2 className="text-4xl font-bold text-foreground mb-4">Error loading admin data</h2>
              <p className="text-xl text-foreground-muted mb-8">{error}</p>
              <button 
                onClick={fetchAdminData}
                className="btn-primary px-10 py-5 text-xl font-bold hover:scale-105 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Admin Dashboard
            </h1>
            <p className="text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
              Overview of your platform metrics and analytics
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mb-12">
            <button 
              onClick={() => alert('Export feature coming soon!')}
              className="btn-outline px-8 py-4 text-lg font-bold hover:scale-105 transition-all duration-300"
            >
              Export Report
            </button>
            <button 
              onClick={fetchAdminData}
              disabled={loading}
              className="btn-primary px-8 py-4 text-lg font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={loading ? "..." : formatNumber(adminData?.metrics.totalUsers || 0)}
            growth={adminData?.metrics.userGrowth || 0}
            color="bg-accent/10"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
          />

          <StatCard
            title="Total Revenue"
            value={loading ? "..." : formatCurrency(adminData?.metrics.totalRevenue || 0)}
            growth={adminData?.metrics.revenueGrowth || 0}
            color="bg-success/10"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            }
          />

          <StatCard
            title="Videos Created"
            value={loading ? "..." : formatNumber(adminData?.metrics.totalVideos || 0)}
            growth={adminData?.metrics.videoGrowth || 0}
            color="bg-warning/10"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            }
          />

          <StatCard
            title="Active Users"
            value={loading ? "..." : formatNumber(adminData?.metrics.activeUsers || 0)}
            growth={5.2}
            color="bg-accent-2/10"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            }
          />
      </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-foreground">Revenue Trend</h3>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent rounded-full"></div>
                  <span className="text-lg text-foreground-muted">Revenue</span>
                </div>
              </div>
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground-muted mb-6">
                    <path d="M3 3v18h18"/>
                    <path d="M18.5 8.5l-3 3-2-2-4 4"/>
                  </svg>
                  <p className="text-xl text-foreground-muted">Chart visualization coming soon</p>
                </div>
              </div>
            </div>

            {/* User Activity Chart */}
            <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-foreground">User Activity</h3>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-success rounded-full"></div>
                  <span className="text-lg text-foreground-muted">Active Users</span>
                </div>
              </div>
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground-muted mb-6">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <p className="text-xl text-foreground-muted">Chart visualization coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <h3 className="text-4xl font-bold text-foreground mb-8">Recent Activity</h3>
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-6 p-6 bg-surface-elevated rounded-2xl animate-pulse">
                      <div className="w-16 h-16 bg-surface rounded-2xl"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-surface rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-surface rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-surface rounded w-20"></div>
                    </div>
                  ))}
                </div>
              ) : adminData?.recentActivity && adminData.recentActivity.length > 0 ? (
                adminData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-6 p-6 bg-surface-elevated rounded-2xl hover:scale-[1.02] transition-all duration-300 group">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      activity.icon === 'user' ? 'bg-success/10' :
                      activity.icon === 'video' ? 'bg-warning/10' :
                      'bg-accent/10'
                    }`}>
                      {activity.icon === 'user' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      ) : activity.icon === 'video' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">{activity.title}</p>
                      <p className="text-base text-foreground-muted">{activity.description}</p>
                    </div>
                    <span className="text-base text-foreground-muted">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground-muted mb-6 mx-auto">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  <h3 className="text-3xl font-bold text-foreground mb-4">No recent activity</h3>
                  <p className="text-xl text-foreground-muted">Activity will appear here as users interact with the platform</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
