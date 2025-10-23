"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Video {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  duration: string;
  thumbnail: string;
  views: number;
  downloads: number;
  videoUrl?: string;
  metadata?: {
    quality?: string;
    format?: string;
    fileSize?: number;
    resolution?: string;
  };
}

export default function VideosPage() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filter !== 'all' && { status: filter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/dashboard/videos?${params}`);
      const data = await response.json();

      if (data.success) {
        setVideos(data.videos);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, filter, searchTerm]);


  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        fetchVideos();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filtering
  };

  const handleVideoAction = async (action: string, videoId: string) => {
    switch (action) {
      case 'download':
        // TODO: Implement download functionality
        alert('Download functionality coming soon!');
        break;
      case 'share':
        // TODO: Implement share functionality
        alert('Share functionality coming soon!');
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this video?')) {
          // TODO: Implement delete functionality
          alert('Delete functionality coming soon!');
        }
        break;
      case 'duplicate':
        // TODO: Implement duplicate functionality
        alert('Duplicate functionality coming soon!');
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/20 text-success";
      case "Processing":
        return "bg-warning/20 text-warning";
      case "Draft":
        return "bg-foreground-muted/20 text-foreground-muted";
      default:
        return "bg-foreground-muted/20 text-foreground-muted";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      
      <div className="relative z-10 space-y-8 p-8">
        {/* Hero Header */}
        <div className="glass-elevated rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-50" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-3">
                  My <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">Videos</span>
                </h1>
                <p className="text-xl text-foreground-muted">Manage and view all your created videos</p>
              </div>
              <Link
                href="/studio"
                className="group relative btn-primary btn-lg px-10 py-5 text-lg font-bold overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Create New Video
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-2/10 to-transparent rounded-bl-3xl" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-6 py-4 rounded-2xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light text-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {["all", "completed", "processing", "queued"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    className={`px-6 py-3 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 ${
                      filter === status
                        ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/25"
                        : "bg-surface text-foreground-muted hover:text-foreground hover:bg-surface-elevated border border-border-strong"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass-elevated rounded-3xl p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl" />
            <div className="relative z-10">
              <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="text-xl text-foreground-muted">Loading videos...</p>
            </div>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {videos.map((video) => (
            <div key={video.id} className="glass-elevated rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl" />
              
              {/* Action Icons - Top Right */}
              {video.status === "Completed" && (
                <div className="absolute top-4 right-4 flex gap-4 z-20">
                  <button 
                    className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-125 group"
                    onClick={() => handleVideoAction('download', video.id)}
                    title="Скачати"
                  >
                    <svg className="w-8 h-8 text-white drop-shadow-lg group-hover:drop-shadow-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  
                  <button 
                    className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-125 group"
                    onClick={() => handleVideoAction('share', video.id)}
                    title="Поширити"
                  >
                    <svg className="w-8 h-8 text-white drop-shadow-lg group-hover:drop-shadow-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                    {video.thumbnail}
                  </div>
                  <div className="flex-1 pr-32">
                    <h3 className="text-xl font-bold text-foreground mb-2 pr-4">{video.title}</h3>
                    <p className="text-lg text-foreground-muted pr-4">{video.createdAt}</p>
                  </div>
                </div>
            
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-foreground-muted">Status</span>
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getStatusColor(video.status)}`}>
                      {video.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-foreground-muted">Duration</span>
                    <span className="text-lg font-bold text-foreground">{video.duration}</span>
                  </div>
                  
                  {video.status === "Completed" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-foreground-muted">Views</span>
                        <span className="text-lg font-bold text-gradient bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">{video.views.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-foreground-muted">Downloads</span>
                        <span className="text-lg font-bold text-gradient bg-gradient-to-r from-accent-2 to-purple-500 bg-clip-text text-transparent">{video.downloads}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {video.status === "Completed" && video.videoUrl ? (
                    <button 
                      className="btn-outline btn-lg py-3 text-lg font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => window.open(video.videoUrl, '_blank')}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                  ) : (
                    <button className="btn-outline btn-lg py-3 text-lg font-bold opacity-50 cursor-not-allowed" disabled>
                      {video.status === "Processing" ? "Processing..." : "View"}
                    </button>
                  )}
                  
                  <button className="btn-outline btn-lg py-3 text-lg font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  
                  <button 
                    className="btn-outline btn-lg py-3 text-lg font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => handleVideoAction('duplicate', video.id)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Duplicate
                  </button>
                  
                  <button 
                    className="btn-outline btn-lg py-3 text-lg font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10"
                    onClick={() => handleVideoAction('delete', video.id)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="glass-elevated rounded-3xl p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl" />
            <div className="relative z-10">
              <div className="text-8xl mb-8">🎥</div>
              <h3 className="text-3xl font-bold text-foreground mb-4">No videos found</h3>
              <p className="text-xl text-foreground-muted mb-8">
                {searchTerm ? "Try adjusting your search terms" : "Create your first video to get started"}
              </p>
              <Link
                href="/studio"
                className="group relative btn-primary btn-lg px-10 py-5 text-lg font-bold overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Create Video
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && videos.length > 0 && (
          <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-xl text-foreground-muted">
                  Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
                </p>
                <div className="flex gap-4">
                  <button 
                    className="btn-outline btn-lg px-8 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300" 
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </span>
                  </button>
                  <button 
                    className="btn-outline btn-lg px-8 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <span className="flex items-center gap-3">
                      Next
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
