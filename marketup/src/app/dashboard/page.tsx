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
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        
        <div className="relative z-10 space-y-8 p-8">
          <div className="glass-elevated rounded-3xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-surface rounded mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-32 bg-surface rounded-xl"></div>
                <div className="h-32 bg-surface rounded-xl"></div>
                <div className="h-32 bg-surface rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      
      <div className="relative z-10 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Hero Welcome Section */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-50" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent via-accent-2 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-2xl font-bold text-white">
                  {session?.user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                  {translations.dashboardWelcomeBack} <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">{translations.dashboardCreator}</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-foreground-muted">{session?.user?.email}</p>
              </div>
            </div>
            
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-xl sm:rounded-bl-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">{translations.dashboardTotalVideos}</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent mb-1 sm:mb-2">
                    {dashboardData?.stats.totalVideos || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">+{dashboardData?.stats.videosThisMonth || 0} {translations.dashboardThisMonth}</p>
                </div>
              </div>
              
              <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent-2/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent-2/10 to-transparent rounded-bl-xl sm:rounded-bl-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">{translations.dashboardCurrentPlan}</h3>
                  </div>
                  <p className="text-xl sm:text-2xl lg:text-2xl font-bold text-gradient bg-gradient-to-r from-accent-2 to-purple-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                    {dashboardData?.subscription?.tier === 'STANDARD' ? 'Pro' :
                     dashboardData?.subscription?.tier === 'PREMIUM' ? 'Premium' :
                     dashboardData?.subscription?.tier === 'BASIC' ? 'Basic' :
                     translations.dashboardFreePlan}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">
                    {dashboardData?.subscription?.tier === 'STANDARD' ? '$42/month' :
                     dashboardData?.subscription?.tier === 'PREMIUM' ? '$59/month' :
                     dashboardData?.subscription?.tier === 'BASIC' ? 'Free' :
                     translations.dashboardUpgradeToPro}
                  </p>
                </div>
              </div>
              
              <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-xl sm:rounded-bl-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">{translations.dashboardStorageUsed}</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                    {dashboardData?.stats.storageUsed || 0}GB
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">
                    {translations.dashboardOfUsed} {dashboardData?.stats.storageLimit || 10}GB used ({dashboardData?.stats.storagePercentage || 0}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="glass-elevated rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-lg sm:rounded-bl-xl lg:rounded-bl-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg lg:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-foreground">{translations.dashboardCompleted}</h3>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                {dashboardData?.stats.completedVideos || 0}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted">{translations.dashboardReadyToView}</p>
            </div>
          </div>
          
          <div className="glass-elevated rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-lg sm:rounded-bl-xl lg:rounded-bl-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg lg:rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-foreground">{translations.dashboardProcessing}</h3>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {dashboardData?.stats.processingVideos || 0}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted">{translations.dashboardInProgress}</p>
            </div>
          </div>
          
          <div className="glass-elevated rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-lg sm:rounded-bl-xl lg:rounded-bl-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg lg:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-foreground">{translations.dashboardTotalViews}</h3>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {dashboardData?.stats.totalViews || 0}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted">{translations.dashboardAllTime}</p>
            </div>
          </div>
          
          <div className="glass-elevated rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-lg sm:rounded-bl-xl lg:rounded-bl-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg lg:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-foreground">{translations.dashboardDownloads}</h3>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {dashboardData?.stats.totalDownloads || 0}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted">{translations.dashboardAllTime}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">{translations.dashboardQuickActions}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Link
                href="/studio"
                className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-xl sm:rounded-bl-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground">{translations.dashboardCreateVideo}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground-muted">{translations.dashboardStartNewProject}</p>
                </div>
              </Link>
              
              <Link
                href="/dashboard/videos"
                className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent-2/20 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-2/10 to-transparent rounded-bl-xl sm:rounded-bl-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground">{translations.dashboardMyVideos}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground-muted">{translations.dashboardViewAllVideos}</p>
                </div>
              </Link>
              
              <Link
                href="/dashboard/subscription"
                className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-xl sm:rounded-bl-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground">{translations.dashboardUpgradePlan}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground-muted">{translations.dashboardManageSubscription}</p>
                </div>
              </Link>
              
              <Link
                href="/dashboard/settings"
                className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-gray-500/20 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-500/10 to-transparent rounded-bl-xl sm:rounded-bl-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground">{translations.dashboardSettings}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground-muted">{translations.dashboardAccountPreferences}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Videos */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-accent-2/10 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{translations.dashboardRecentVideos}</h2>
              <Link
                href="/dashboard/videos"
                className="text-accent hover:text-accent-hover font-medium transition-colors text-sm sm:text-base lg:text-lg"
              >
                {translations.dashboardViewAll}
              </Link>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {dashboardData?.recentVideos && dashboardData.recentVideos.length > 0 ? (
                dashboardData.recentVideos.map((video) => (
                  <div key={video.id} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:scale-[1.01] transition-all duration-300 hover:shadow-xl group">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center text-lg sm:text-2xl group-hover:scale-110 transition-transform">
                        {video.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-1 sm:mb-2 truncate">{video.title}</h3>
                        <p className="text-xs sm:text-sm text-foreground-muted mb-2 sm:mb-3">{video.createdAt}</p>
                        {video.status === 'Completed' && (
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                            <span className="text-xs sm:text-sm text-foreground-muted flex items-center gap-1 sm:gap-2">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {video.views} {translations.dashboardViews}
                            </span>
                            <span className="text-xs sm:text-sm text-foreground-muted flex items-center gap-1 sm:gap-2">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {video.downloads} {translations.dashboardDownloads}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold ${
                          video.status === 'Completed' 
                            ? 'bg-green-500/20 text-green-500' 
                            : video.status === 'Processing'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-foreground-muted/20 text-foreground-muted'
                        }`}>
                          {video.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 sm:py-16">
                  <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎥</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{translations.dashboardNoVideosYet}</h3>
                  <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-6 sm:mb-8">{translations.dashboardCreateFirstVideo}</p>
                  <Link
                    href="/studio"
                    className="group relative btn-primary btn-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-bold overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {translations.dashboardCreateVideo}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
