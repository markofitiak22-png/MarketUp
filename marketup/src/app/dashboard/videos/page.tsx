"use client";
import { useState } from "react";
import Link from "next/link";

export default function VideosPage() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const videos = [
    {
      id: 1,
      title: "Coffee Shop Promo",
      status: "Completed",
      createdAt: "2024-01-15",
      duration: "0:30",
      thumbnail: "☕",
      views: 1250,
      downloads: 45
    },
    {
      id: 2,
      title: "Restaurant Menu Showcase",
      status: "Processing",
      createdAt: "2024-01-14",
      duration: "1:15",
      thumbnail: "🍽️",
      views: 0,
      downloads: 0
    },
    {
      id: 3,
      title: "Product Launch Video",
      status: "Completed",
      createdAt: "2024-01-12",
      duration: "0:45",
      thumbnail: "🚀",
      views: 2100,
      downloads: 78
    },
    {
      id: 4,
      title: "Brand Story",
      status: "Draft",
      createdAt: "2024-01-10",
      duration: "2:30",
      thumbnail: "📖",
      views: 0,
      downloads: 0
    },
    {
      id: 5,
      title: "Holiday Special",
      status: "Completed",
      createdAt: "2024-01-08",
      duration: "1:00",
      thumbnail: "🎄",
      views: 3400,
      downloads: 120
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesFilter = filter === "all" || video.status.toLowerCase() === filter;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
            />
          </div>
          <div className="flex gap-2">
            {["all", "completed", "processing", "draft"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
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

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
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
              <button className="flex-1 btn-outline py-2 text-sm">
                View
              </button>
              <button className="flex-1 btn-outline py-2 text-sm">
                Edit
              </button>
              <button className="btn-outline py-2 px-3 text-sm">
                ⋯
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
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
      {filteredVideos.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            Showing {filteredVideos.length} of {videos.length} videos
          </p>
          <div className="flex gap-2">
            <button className="btn-outline px-3 py-2 text-sm" disabled>
              Previous
            </button>
            <button className="btn-outline px-3 py-2 text-sm">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
