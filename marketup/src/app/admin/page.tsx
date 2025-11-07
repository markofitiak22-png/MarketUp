"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line, LineChart } from "recharts";

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
    videos: {
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
  const { translations } = useTranslations();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin dashboard data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching admin data...');
      const response = await fetch('/api/admin/dashboard', {
        credentials: "include",
      });
      console.log('Admin API response status:', response.status);
      
      const data = await response.json();
      console.log('Admin API response data:', data);
      
      if (data.success) {
        setAdminData(data.data);
      } else {
        console.error('Admin API returned error:', data.error);
        setError(data.error || translations.adminErrorLoadingData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError(translations.adminNetworkErrorOccurred);
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
    <div className="glass-elevated rounded-2xl p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className={`p-3 sm:p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`text-sm sm:text-base lg:text-lg font-bold ${growth >= 0 ? 'text-success' : 'text-error'}`}>
          {growth >= 0 ? '+' : ''}{growth}%
        </div>
      </div>
      <div>
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          {loading ? (
            <div className="w-20 sm:w-24 h-8 sm:h-10 bg-surface-elevated rounded animate-pulse"></div>
          ) : (
            value
          )}
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-foreground-muted">{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="glass-elevated rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-surface rounded mb-4"></div>
            <div className="h-3 sm:h-4 bg-surface rounded w-2/3"></div>
          </div>
        </div>
        <div className="glass-elevated rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-3 sm:space-y-4">
            <div className="h-12 sm:h-16 bg-surface rounded"></div>
            <div className="h-12 sm:h-16 bg-surface rounded"></div>
            <div className="h-12 sm:h-16 bg-surface rounded"></div>
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

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-elevated rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">⚠️</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">{translations.adminErrorLoadingData}</h2>
              <p className="text-sm sm:text-base lg:text-xl text-foreground-muted mb-6 sm:mb-8">{error}</p>
              <button 
                onClick={fetchAdminData}
                className="btn-primary px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-xl font-bold hover:scale-105 transition-all duration-300 rounded-xl sm:rounded-2xl"
              >
                {translations.adminTryAgain}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
          {/* Hero Header */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-foreground-muted max-w-2xl mx-auto leading-relaxed">
              {translations.adminOverviewDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
            <button 
              onClick={() => alert('Export feature coming soon!')}
              className="btn-outline px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold hover:scale-105 transition-all duration-300 rounded-xl sm:rounded-2xl"
            >
              {translations.adminExportReport}
            </button>
            <button 
              onClick={fetchAdminData}
              disabled={loading}
              className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl sm:rounded-2xl"
            >
              {loading ? translations.adminRefreshing : translations.adminRefreshData}
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <StatCard
            title={translations.adminTotalUsers}
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
            title={translations.adminTotalRevenue}
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
            title={translations.adminVideosCreated}
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
            title={translations.adminActiveUsers}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Video Activity Chart */}
            <div className="glass-elevated rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">Video Activity</h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-warning rounded-full"></div>
                  <span className="text-sm sm:text-base lg:text-lg text-foreground-muted">Videos Created</span>
                </div>
              </div>
              <div className="h-60 sm:h-70 lg:h-80 w-full">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full"></div>
                  </div>
                ) : adminData?.charts?.videos ? (
                  (() => {
                    const chartData = adminData.charts.videos.labels?.map((label: string, index: number) => ({
                      name: label,
                      videos: adminData.charts.videos.data?.[index] || 0
                    })) || [];
                    
                    if (!chartData || chartData.length === 0) {
                      return (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm sm:text-base lg:text-xl text-foreground-muted">No data available</p>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#a1a1aa"
                            style={{ fontSize: '12px' }}
                            tick={{ fill: '#a1a1aa' }}
                          />
                          <YAxis 
                            stroke="#a1a1aa"
                            style={{ fontSize: '12px' }}
                            tick={{ fill: '#a1a1aa' }}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(18, 19, 21, 0.95)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: '#e6e7ea'
                            }}
                            labelStyle={{ color: '#e6e7ea', marginBottom: '4px' }}
                            formatter={(value: any) => [value, 'Videos']}
                          />
                          <Line
                            type="monotone"
                            dataKey="videos"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={{ fill: '#f59e0b', r: 5, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 7, stroke: '#f59e0b', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    );
                  })()
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground-muted mb-4 sm:mb-6">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                      <p className="text-sm sm:text-base lg:text-xl text-foreground-muted">{translations.adminChartVisualizationComingSoon}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Activity Chart */}
            <div className="glass-elevated rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">{translations.adminUserActivity}</h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-success rounded-full"></div>
                  <span className="text-sm sm:text-base lg:text-lg text-foreground-muted">{translations.adminActiveUsers}</span>
                </div>
              </div>
              <div className="h-60 sm:h-70 lg:h-80 w-full">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full"></div>
                  </div>
                ) : adminData?.charts?.users ? (
                  (() => {
                    const chartData = adminData.charts.users.labels?.map((label: string, index: number) => ({
                      name: label,
                      users: adminData.charts.users.data?.[index] || 0
                    })) || [];
                    
                    // Ensure we have valid data
                    if (!chartData || chartData.length === 0) {
                      return (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm sm:text-base lg:text-xl text-foreground-muted">No data available</p>
                          </div>
                        </div>
                      );
                    }
                    
                    const gradientId = `colorUsers-${Date.now()}`;
                    
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                          <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#a1a1aa"
                            style={{ fontSize: '12px' }}
                            tick={{ fill: '#a1a1aa' }}
                          />
                          <YAxis 
                            stroke="#a1a1aa"
                            style={{ fontSize: '12px' }}
                            tick={{ fill: '#a1a1aa' }}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(18, 19, 21, 0.95)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: '#e6e7ea'
                            }}
                            labelStyle={{ color: '#e6e7ea', marginBottom: '4px' }}
                            formatter={(value: any) => [value, 'Users']}
                          />
                          <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                            dot={{ fill: '#10b981', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    );
                  })()
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground-muted mb-4 sm:mb-6">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <p className="text-sm sm:text-base lg:text-xl text-foreground-muted">{translations.adminChartVisualizationComingSoon}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-elevated rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group max-w-6xl mx-auto">
            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8">{translations.adminRecentActivity}</h3>
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {loading ? (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 bg-surface-elevated rounded-xl sm:rounded-2xl animate-pulse">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-surface rounded-xl sm:rounded-2xl"></div>
                      <div className="flex-1">
                        <div className="h-4 sm:h-5 lg:h-6 bg-surface rounded w-3/4 mb-2 sm:mb-3"></div>
                        <div className="h-3 sm:h-4 bg-surface rounded w-1/2"></div>
                      </div>
                      <div className="h-3 sm:h-4 bg-surface rounded w-16 sm:w-20"></div>
                    </div>
                  ))}
                </div>
              ) : adminData?.recentActivity && adminData.recentActivity.length > 0 ? (
                adminData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 bg-surface-elevated rounded-xl sm:rounded-2xl hover:scale-[1.02] transition-all duration-300 group">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                      activity.icon === 'user' ? 'bg-success/10' :
                      activity.icon === 'video' ? 'bg-warning/10' :
                      'bg-accent/10'
                    }`}>
                      {activity.icon === 'user' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      ) : activity.icon === 'video' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">{activity.title}</p>
                      <p className="text-xs sm:text-sm lg:text-base text-foreground-muted truncate">{activity.description}</p>
                    </div>
                    <span className="text-xs sm:text-sm lg:text-base text-foreground-muted whitespace-nowrap">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-10 lg:py-12">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground-muted mb-4 sm:mb-6 mx-auto">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">{translations.adminNoRecentActivity}</h3>
                  <p className="text-sm sm:text-base lg:text-xl text-foreground-muted">{translations.adminActivityWillAppearHere}</p>
                </div>
              )}
            </div>
          </div>
        </div>
  );
}
