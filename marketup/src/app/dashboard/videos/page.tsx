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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.relative')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

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
    setOpenDropdown(null);
    
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Videos</h1>
          <p className="text-foreground-muted">Manage and view all your created videos</p>
        </div>
        <Link
          href="/studio"
          className="btn-primary px-6 py-3"
        >
          Create New Video
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="glass-elevated rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
            />
          </div>
          <div className="flex gap-2">
            {["all", "completed", "processing", "queued"].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-accent text-white"
                    : "bg-surface text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-elevated rounded-2xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground-muted">Loading videos...</p>
        </div>
      )}

      {/* Videos Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
          <div key={video.id} className="glass-elevated rounded-2xl p-6 hover:bg-surface-elevated transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center text-3xl">
                {video.thumbnail}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
                <p className="text-sm text-foreground-muted">{video.createdAt}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                  {video.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">Duration</span>
                <span className="text-sm font-medium text-foreground">{video.duration}</span>
              </div>
              
              {video.status === "Completed" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground-muted">Views</span>
                    <span className="text-sm font-medium text-foreground">{video.views.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground-muted">Downloads</span>
                    <span className="text-sm font-medium text-foreground">{video.downloads}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              {video.status === "Completed" && video.videoUrl ? (
                <button 
                  className="flex-1 btn-outline py-2 text-sm"
                  onClick={() => window.open(video.videoUrl, '_blank')}
                >
                  View
                </button>
              ) : (
                <button className="flex-1 btn-outline py-2 text-sm" disabled>
                  {video.status === "Processing" ? "Processing..." : "View"}
                </button>
              )}
              <button className="flex-1 btn-outline py-2 text-sm">
                Edit
              </button>
              <div className="relative">
                <button 
                  className="btn-outline py-2 px-3 text-sm"
                  onClick={() => setOpenDropdown(openDropdown === video.id ? null : video.id)}
                >
                  ⋯
                </button>
                
                {openDropdown === video.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface-elevated border border-border-strong rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      {video.status === "Completed" && (
                        <>
                          <button
                            className="w-full px-4 py-2 text-sm text-left hover:bg-surface text-foreground"
                            onClick={() => handleVideoAction('download', video.id)}
                          >
                            📥 Download
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left hover:bg-surface text-foreground"
                            onClick={() => handleVideoAction('share', video.id)}
                          >
                            🔗 Share
                          </button>
                        </>
                      )}
                      <button
                        className="w-full px-4 py-2 text-sm text-left hover:bg-surface text-foreground"
                        onClick={() => handleVideoAction('duplicate', video.id)}
                      >
                        📋 Duplicate
                      </button>
                      <hr className="my-1 border-border" />
                      <button
                        className="w-full px-4 py-2 text-sm text-left hover:bg-surface text-red-500"
                        onClick={() => handleVideoAction('delete', video.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <div className="glass-elevated rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No videos found</h3>
          <p className="text-foreground-muted mb-6">
            {searchTerm ? "Try adjusting your search terms" : "Create your first video to get started"}
          </p>
          <Link
            href="/studio"
            className="btn-primary px-6 py-3"
          >
            Create Video
          </Link>
        </div>
      )}

      {/* Pagination */}
      {!loading && videos.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button 
              className="btn-outline px-3 py-2 text-sm" 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button 
              className="btn-outline px-3 py-2 text-sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
