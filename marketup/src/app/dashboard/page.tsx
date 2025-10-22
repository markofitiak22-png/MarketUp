"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-elevated rounded-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="h-24 bg-surface rounded"></div>
              <div className="h-24 bg-surface rounded"></div>
              <div className="h-24 bg-surface rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-elevated rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-foreground-muted">{session?.user?.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground">Total Videos</h3>
            </div>
            <p className="text-3xl font-bold text-accent">{dashboardData?.stats.totalVideos || 0}</p>
            <p className="text-sm text-foreground-muted">+{dashboardData?.stats.videosThisMonth || 0} this month</p>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
            </div>
            <p className="text-xl font-bold text-foreground">
              {dashboardData?.subscription?.tier || 'Free Plan'}
            </p>
            <p className="text-sm text-foreground-muted">
              {dashboardData?.subscription ? 
                `$29/month` : 
                'Upgrade to Pro'
              }
            </p>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground">Storage Used</h3>
            </div>
            <p className="text-3xl font-bold text-accent">{dashboardData?.stats.storageUsed || 0}GB</p>
            <p className="text-sm text-foreground-muted">
              of {dashboardData?.stats.storageLimit || 10}GB used ({dashboardData?.stats.storagePercentage || 0}%)
            </p>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-elevated rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-accent">{dashboardData?.stats.completedVideos || 0}</p>
          <p className="text-sm text-foreground-muted">Ready to view</p>
        </div>
        
        <div className="glass-elevated rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground">Processing</h3>
          </div>
          <p className="text-3xl font-bold text-accent">{dashboardData?.stats.processingVideos || 0}</p>
          <p className="text-sm text-foreground-muted">In progress</p>
        </div>
        
        <div className="glass-elevated rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground">Total Views</h3>
          </div>
          <p className="text-3xl font-bold text-accent">{dashboardData?.stats.totalViews || 0}</p>
          <p className="text-sm text-foreground-muted">All time</p>
        </div>
        
        <div className="glass-elevated rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground">Downloads</h3>
          </div>
          <p className="text-3xl font-bold text-accent">{dashboardData?.stats.totalDownloads || 0}</p>
          <p className="text-sm text-foreground-muted">All time</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-elevated rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/studio"
            className="glass rounded-xl p-6 hover:bg-surface-elevated transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-foreground">Create Video</h3>
            </div>
            <p className="text-sm text-foreground-muted">Start a new video project</p>
          </Link>
          
          <Link
            href="/dashboard/videos"
            className="glass rounded-xl p-6 hover:bg-surface-elevated transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="font-semibold text-foreground">My Videos</h3>
            </div>
            <p className="text-sm text-foreground-muted">View all your videos</p>
          </Link>
          
          <Link
            href="/dashboard/subscription"
            className="glass rounded-xl p-6 hover:bg-surface-elevated transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 className="font-semibold text-foreground">Upgrade Plan</h3>
            </div>
            <p className="text-sm text-foreground-muted">Manage your subscription</p>
          </Link>
          
          <Link
            href="/dashboard/settings"
            className="glass rounded-xl p-6 hover:bg-surface-elevated transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-semibold text-foreground">Settings</h3>
            </div>
            <p className="text-sm text-foreground-muted">Account preferences</p>
          </Link>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="glass-elevated rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Videos</h2>
          <Link
            href="/dashboard/videos"
            className="text-accent hover:text-accent-hover font-medium transition-colors"
          >
            View all
          </Link>
        </div>
        
        <div className="space-y-4">
          {dashboardData?.recentVideos && dashboardData.recentVideos.length > 0 ? (
            dashboardData.recentVideos.map((video) => (
              <div key={video.id} className="glass rounded-xl p-4 hover:bg-surface-elevated transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center text-accent">
                    <span className="text-2xl">{video.thumbnail}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{video.title}</h3>
                    <p className="text-sm text-foreground-muted">{video.createdAt}</p>
                    {video.status === 'Completed' && (
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-foreground-muted">
                          👁️ {video.views} views
                        </span>
                        <span className="text-xs text-foreground-muted">
                          📥 {video.downloads} downloads
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      video.status === 'Completed' 
                        ? 'bg-success/20 text-success' 
                        : video.status === 'Processing'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-foreground-muted/20 text-foreground-muted'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No videos yet</h3>
              <p className="text-foreground-muted mb-4">Create your first video to get started</p>
              <Link
                href="/studio"
                className="btn-primary px-6 py-3"
              >
                Create Video
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
