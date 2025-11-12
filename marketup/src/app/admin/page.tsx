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
        
        <div className="relative z-10 space-y-8 p-3 sm:p-6 lg:p-8">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="animate-pulse">
              <div className="h-8 bg-slate-800/40 rounded mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-32 bg-slate-800/40 rounded-xl"></div>
                <div className="h-32 bg-slate-800/40 rounded-xl"></div>
          </div>
        </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">{translations.adminErrorLoadingData}</h2>
              <p className="text-sm sm:text-base lg:text-xl text-white/60 mb-6 sm:mb-8">{error}</p>
              <button 
                onClick={fetchAdminData}
                className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm sm:text-base lg:text-xl font-bold hover:scale-105 transition-all duration-300 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/20"
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
    <div className="min-h-screen bg-[#0b0b0b] relative overflow-x-hidden w-full">
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

      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 w-full overflow-x-hidden">
        {/* Header Section with Badge */}
        <div className="mb-4 sm:mb-8">
          <div className="hidden sm:flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>Admin Dashboard</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              Welcome Back <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Admin</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/60">{translations.adminOverviewDescription || "Overview of your platform metrics and analytics"}</p>
          </div>
        </div>

        {/* Main Stats - Large Cards in Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8 w-full">
          {/* Total Users - Large Card */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTotalUsers}</h3>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5 sm:mt-1">
                      {loading ? "..." : formatNumber(adminData?.metrics.totalUsers || 0)}
                    </p>
                  </div>
                </div>
                <div className={`text-xs sm:text-sm font-bold ${(adminData?.metrics.userGrowth || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(adminData?.metrics.userGrowth || 0) >= 0 ? '+' : ''}{adminData?.metrics.userGrowth || 0}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">{adminData?.metrics.activeUsers || 0} {translations.adminActiveUsers}</span>
              </div>
            </div>
          </div>

          {/* Total Revenue - Compact Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-green-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.adminTotalRevenue}</h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {loading ? "..." : formatCurrency(adminData?.metrics.totalRevenue || 0)}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="flex justify-between text-xs text-white/60 mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-xs">Growth</span>
                  <span className={`text-[10px] sm:text-xs font-bold ${(adminData?.metrics.revenueGrowth || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(adminData?.metrics.revenueGrowth || 0) >= 0 ? '+' : ''}{adminData?.metrics.revenueGrowth || 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.abs(adminData?.metrics.revenueGrowth || 0))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
      </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8 w-full">
          {/* Left Column - Charts Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
            {/* Video Activity Chart */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white">Video Activity</h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm sm:text-base lg:text-lg text-white/60">Videos Created</span>
                </div>
              </div>
              <div className="h-60 sm:h-70 lg:h-80 w-full overflow-x-auto">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
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
                            <p className="text-sm sm:text-base lg:text-xl text-white/60">No data available</p>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <ResponsiveContainer width="100%" height="100%" minWidth={300}>
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
                              backgroundColor: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(51, 65, 85, 0.6)',
                              borderRadius: '8px',
                              color: '#ffffff',
                              backdropFilter: 'blur(8px)'
                            }}
                            labelStyle={{ color: '#ffffff', marginBottom: '4px' }}
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
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 mb-4 sm:mb-6">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                      <p className="text-sm sm:text-base lg:text-xl text-white/60">{translations.adminChartVisualizationComingSoon}</p>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* User Activity Chart */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white">{translations.adminUserActivity}</h3>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm sm:text-base lg:text-lg text-white/60">{translations.adminActiveUsers}</span>
                </div>
              </div>
              <div className="h-60 sm:h-70 lg:h-80 w-full overflow-x-auto">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
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
                            <p className="text-sm sm:text-base lg:text-xl text-white/60">No data available</p>
                          </div>
                        </div>
                      );
                    }
                    
                    const gradientId = `colorUsers-${Date.now()}`;
                    
                    return (
                      <ResponsiveContainer width="100%" height="100%" minWidth={300}>
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
                              backgroundColor: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(51, 65, 85, 0.6)',
                              borderRadius: '8px',
                              color: '#ffffff',
                              backdropFilter: 'blur(8px)'
                            }}
                            labelStyle={{ color: '#ffffff', marginBottom: '4px' }}
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
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 mb-4 sm:mb-6">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <p className="text-sm sm:text-base lg:text-xl text-white/60">{translations.adminChartVisualizationComingSoon}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
            </div>
          </div>
          
          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Videos Created Card */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-yellow-500/40 transition-all duration-300">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.adminVideosCreated}</h3>
                    <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent truncate">
                      {loading ? "..." : formatNumber(adminData?.metrics.totalVideos || 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-white/60">Growth</span>
                  <span className={`text-xs sm:text-sm font-bold ${(adminData?.metrics.videoGrowth || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(adminData?.metrics.videoGrowth || 0) >= 0 ? '+' : ''}{adminData?.metrics.videoGrowth || 0}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminActions || "Quick Actions"}</h3>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => alert('Export feature coming soon!')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{translations.adminExportReport}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">Export data</p>
                  </div>
                </button>
                
                <button
                  onClick={fetchAdminData}
                  disabled={loading}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{loading ? translations.adminRefreshing : translations.adminRefreshData}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">Update data</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Full Width */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 max-w-6xl mx-auto w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">{translations.adminRecentActivity}</h3>
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {loading ? (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 bg-slate-800/40 rounded-xl sm:rounded-2xl animate-pulse">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-slate-800/60 rounded-xl sm:rounded-2xl"></div>
                      <div className="flex-1">
                        <div className="h-4 sm:h-5 lg:h-6 bg-slate-800/60 rounded w-3/4 mb-2 sm:mb-3"></div>
                        <div className="h-3 sm:h-4 bg-slate-800/60 rounded w-1/2"></div>
                      </div>
                      <div className="h-3 sm:h-4 bg-slate-800/60 rounded w-16 sm:w-20"></div>
                    </div>
                  ))}
                </div>
              ) : adminData?.recentActivity && adminData.recentActivity.length > 0 ? (
                adminData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 bg-slate-800/40 rounded-xl sm:rounded-2xl hover:scale-[1.02] hover:bg-slate-800/60 transition-all duration-300 group border border-slate-700/60 hover:border-indigo-500/40">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                      activity.icon === 'user' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                      activity.icon === 'video' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                      'bg-gradient-to-br from-indigo-500 to-purple-500'
                    }`}>
                      {activity.icon === 'user' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      ) : activity.icon === 'video' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">{activity.title}</p>
                      <p className="text-xs sm:text-sm lg:text-base text-white/60 truncate">{activity.description}</p>
                    </div>
                    <span className="text-xs sm:text-sm lg:text-base text-white/60 whitespace-nowrap">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-10 lg:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">{translations.adminNoRecentActivity}</h3>
                  <p className="text-sm sm:text-base lg:text-xl text-white/60">{translations.adminActivityWillAppearHere}</p>
                </div>
              )}
            </div>
            </div>
            </div>
          </div>
        </div>
  );
}
