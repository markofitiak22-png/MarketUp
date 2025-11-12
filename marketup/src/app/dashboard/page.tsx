"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

interface DashboardData {
  stats: {
    totalVideos: number;
    completedVideos: number;
    processingVideos: number;
    totalViews: number;
    totalDownloads: number;
    videosThisMonth: number;
    storageUsed: number;
    storageLimit: number;
    storagePercentage: number;
  };
  subscription: {
    tier: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
  recentVideos: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    thumbnail: string;
    views: number;
    downloads: number;
  }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { translations } = useTranslations();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/overview');
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh data when success parameter is present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Wait a bit for webhook to process, then refresh
      setTimeout(() => {
        fetchDashboardData();
        // Remove success parameter from URL
        window.history.replaceState({}, '', '/dashboard');
      }, 2000);
    }
  }, []);

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
        
        <div className="relative z-10 space-y-8 p-8">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-800/40 rounded mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-32 bg-slate-800/40 rounded-xl"></div>
                <div className="h-32 bg-slate-800/40 rounded-xl"></div>
                <div className="h-32 bg-slate-800/40 rounded-xl"></div>
              </div>
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
              <span>Dashboard</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
          
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {session?.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              {translations.dashboardWelcomeBack} <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{translations.dashboardCreator}</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/60">{session?.user?.email}</p>
          </div>
        </div>

        {/* Main Stats - Large Cards in Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Videos - Large Card */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.dashboardTotalVideos}</h3>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5 sm:mt-1">
                      {dashboardData?.stats.totalVideos || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">+{dashboardData?.stats.videosThisMonth || 0} {translations.dashboardThisMonth}</span>
              </div>
            </div>
          </div>

          {/* Storage - Compact Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.dashboardStorageUsed}</h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {typeof dashboardData?.stats.storageUsed === 'number' ? parseFloat(dashboardData.stats.storageUsed.toFixed(2)) : 0}GB
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="flex justify-between text-xs text-white/60 mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-xs">{translations.dashboardOfUsed} {dashboardData?.stats.storageLimit || 10}GB</span>
                  <span className="text-[10px] sm:text-xs">{dashboardData?.stats.storagePercentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-800/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${dashboardData?.stats.storagePercentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Left Column - Performance Stats Grid */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">{translations.dashboardPerformance || "Performance"}</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {/* Completed */}
                <div className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 group hover:border-green-500/40 transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">{translations.dashboardCompleted}</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {dashboardData?.stats.completedVideos || 0}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">{translations.dashboardReadyToView}</p>
                </div>
                
                {/* Processing */}
                <div className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 group hover:border-yellow-500/40 transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">{translations.dashboardProcessing}</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {dashboardData?.stats.processingVideos || 0}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">{translations.dashboardInProgress}</p>
                </div>
                
                {/* Views */}
                <div className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 group hover:border-blue-500/40 transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">{translations.dashboardTotalViews}</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {dashboardData?.stats.totalViews || 0}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">{translations.dashboardAllTime}</p>
                </div>
                
                {/* Downloads */}
                <div className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 group hover:border-purple-500/40 transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider leading-tight">{translations.dashboardDownloads}</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {dashboardData?.stats.totalDownloads || 0}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">{translations.dashboardAllTime}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Subscription & Quick Actions */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Subscription Card */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.dashboardCurrentPlan}</h3>
                    <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                      {dashboardData?.subscription?.tier === 'STANDARD' ? 'Pro' :
                       dashboardData?.subscription?.tier === 'PREMIUM' ? 'Premium' :
                       dashboardData?.subscription?.tier === 'BASIC' ? 'Basic' :
                       translations.dashboardFreePlan}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
                  {dashboardData?.subscription?.tier === 'STANDARD' ? '$42/month' :
                   dashboardData?.subscription?.tier === 'PREMIUM' ? '$59/month' :
                   dashboardData?.subscription?.tier === 'BASIC' ? 'Free' :
                   translations.dashboardUpgradeToPro}
                </p>
                <Link
                  href="/dashboard/subscription"
                  className="block w-full text-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300"
                >
                  {translations.dashboardManageSubscription}
                </Link>
              </div>
            </div>
            
            {/* Quick Actions - Compact */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.dashboardQuickActions}</h3>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href="/studio"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{translations.dashboardCreateVideo}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">{translations.dashboardStartNewProject}</p>
                  </div>
                </Link>
                
                <Link
                  href="/dashboard/videos"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{translations.dashboardMyVideos}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">{translations.dashboardViewAllVideos}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Videos - Full Width */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{translations.dashboardRecentVideos}</h2>
              <Link
                href="/dashboard/videos"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors text-xs sm:text-sm lg:text-base flex items-center gap-1.5 sm:gap-2"
              >
                {translations.dashboardViewAll}
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {dashboardData?.recentVideos && dashboardData.recentVideos.length > 0 ? (
                dashboardData.recentVideos.map((video) => (
                  <div key={video.id} className="bg-slate-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group">
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-white mb-1 truncate">{video.title}</h3>
                        <p className="text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2">{video.createdAt}</p>
                        <span className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold ${
                          video.status === 'Completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : video.status === 'Processing'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {video.status}
                        </span>
                      </div>
                    </div>
                    {video.status === 'Completed' && (
                      <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-700/60">
                        <span className="text-[10px] sm:text-xs text-white/60 flex items-center gap-1 sm:gap-1.5">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {video.views}
                        </span>
                        <span className="text-[10px] sm:text-xs text-white/60 flex items-center gap-1 sm:gap-1.5">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {video.downloads}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12 lg:py-16">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{translations.dashboardNoVideosYet}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-white/60 mb-4 sm:mb-6">{translations.dashboardCreateFirstVideo}</p>
                  <Link
                    href="/studio"
                    className="inline-flex items-center justify-center px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 gap-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {translations.dashboardCreateVideo}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
