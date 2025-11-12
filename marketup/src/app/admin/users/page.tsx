"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastActive: string;
  subscription: "Basic" | "Premium" | "Enterprise" | "Free";
  videosCreated: number;
  totalSpent: number;
  avatar?: string;
  locale?: string;
  country?: string;
  createdAt: string;
  hasActiveSubscription: boolean;
  subscriptionStatus: string;
}

interface EditUserData {
  name: string;
  email: string;
  role: string;
  subscription: "Basic" | "Premium" | "Enterprise" | "Free";
}

export default function UsersPage() {
  const { translations } = useTranslations();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubscription, setFilterSubscription] = useState("all");
  const [sortBy, setSortBy] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserData>({
    name: "",
    email: "",
    role: "",
    subscription: "Basic"
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalRevenue: 0
  });

  // Fetch users data
  const fetchUsers = async (page: number = currentPage) => {
    try {
      setLoading(true);
      console.log('Fetching users data...');
      
      const params = new URLSearchParams({
        search: searchTerm,
        subscription: filterSubscription,
        sortBy,
        sortOrder,
        page: page.toString(),
        limit: '10'
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: "include",
      });
      console.log('Users API response status:', response.status);
      
      const data = await response.json();
      console.log('Users API response data:', data);
      
      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
        setCurrentPage(data.data.pagination.page);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      } else {
        console.error('Users API returned error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchUsers(1);
  }, [searchTerm, filterSubscription, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      fetchUsers(page);
      setSelectedUsers([]); // Clear selection when changing page
    }
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    );
  };

  // Handle user editing
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          userId: editingUser.id,
          updates: editForm
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh users list
        fetchUsers(currentPage);
        setEditingUser(null);
        alert(translations.adminUserUpdatedSuccessfully);
      } else {
        alert(translations.adminFailedToUpdateUser + ' ' + data.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert(translations.adminErrorUpdatingUser);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      name: "",
      email: "",
      role: "",
      subscription: "Basic"
    });
  };

  // Handle single user actions
  const handleUserAction = async (userId: string, action: string) => {
    try {
      if (action === 'view') {
        // Show user details modal or redirect to user profile
        alert(`View user details for user ID: ${userId} - coming soon!`);
      } else if (action === 'suspend') {
        if (!confirm(`Are you sure you want to suspend this user?`)) {
          return;
        }
        // Implement suspend user logic
        alert(`Suspend user functionality - coming soon!`);
      } else if (action === 'delete') {
        if (!confirm(`Are you sure you want to delete this user? This action cannot be undone.`)) {
          return;
        }
        
        const response = await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({
            userIds: [userId]
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert(`User deleted successfully!`);
          // If current page becomes empty, go to previous page
          if (users.length === 1 && currentPage > 1) {
            handlePageChange(currentPage - 1);
          } else {
            fetchUsers(currentPage);
          }
        } else {
          alert('Failed to delete user: ' + data.error);
        }
      }
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
      alert(`Error performing ${action} action`);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    
    try {
      if (action === 'delete') {
        if (!confirm(`${translations.adminAreYouSureDeleteUsers} ${selectedUsers.length} users? This action cannot be undone.`)) {
          return;
        }
        
        const response = await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({
            userIds: selectedUsers
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert(`${selectedUsers.length} ${translations.adminUsersDeletedSuccessfully}`);
          // If current page becomes empty, go to previous page
          if (users.length <= selectedUsers.length && currentPage > 1) {
            handlePageChange(currentPage - 1);
          } else {
            fetchUsers(currentPage);
          }
        } else {
          alert(translations.adminFailedToDeleteUsers + ' ' + data.error);
        }
      } else {
        // For other actions (activate, suspend), show placeholder
        alert(`${action} ${translations.adminActionComingSoon} ${selectedUsers.length} users - coming soon!`);
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      alert(`${translations.adminErrorPerformingAction} ${action} action`);
    }
    
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  // Users are already filtered and sorted by the API
  const filteredUsers = users;

  // Calculate stats
  // Use stats from API (for all users, not just current page)
  const totalUsers = stats.totalUsers;
  const activeUsers = stats.activeUsers;
  const premiumUsers = stats.premiumUsers;
  const totalRevenue = stats.totalRevenue;

  const getSubscriptionBadge = (subscription: string) => {
    const styles = {
      Premium: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      Basic: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Free: "bg-slate-500/20 text-slate-400 border-slate-500/30"
    };
    
    return (
      <span className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold border ${styles[subscription as keyof typeof styles] || styles.Free}`}>
        {subscription}
      </span>
    );
  };

  if (loading && users.length === 0) {
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
              <div className="h-64 bg-slate-800/40 rounded-xl"></div>
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
              <span>{translations.adminUsersManagement || "Users Management"}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>

          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              {translations.adminUsersManagement || "Users Management"}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/60">{translations.adminUsersManagementDescription}</p>
          </div>
        </div>

        {/* Main Stats - Large Cards in Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Users - Large Card */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTotalUsers || "Total Users"}</h3>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5 sm:mt-1">
                      {loading ? "..." : totalUsers}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">{activeUsers} {translations.adminActiveUsers || "Active"}</span>
              </div>
            </div>
          </div>
          
          {/* Active Users - Compact Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-green-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.adminActiveUsers || "Active Users"}</h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {loading ? "..." : activeUsers}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="flex justify-between text-xs text-white/60 mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-xs">{translations.adminOfUsers || "of"} {totalUsers}</span>
                  <span className="text-[10px] sm:text-xs font-bold">{totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-800/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Left Column - Filters and Table */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Filters and Search */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.adminSearch || "Search"}</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                  placeholder={translations.adminSearchUsers || "Search users..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
              />
            </div>

              <button
                onClick={() => alert('Add user feature coming soon!')}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 whitespace-nowrap"
              >
                {translations.adminAddUser || "Add User"}
              </button>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-lg sm:rounded-xl">
                <span className="text-sm sm:text-base font-bold text-white">
                  {selectedUsers.length} {selectedUsers.length !== 1 ? (translations.adminUsersSelected || "users selected") : (translations.adminUserSelected || "user selected")}
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleBulkAction('activate')}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-500/30 transition-all duration-300 hover:scale-105"
                >
                    {translations.adminActivate || "Activate"}
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs sm:text-sm font-semibold hover:bg-yellow-500/30 transition-all duration-300 hover:scale-105"
                >
                    {translations.adminSuspend || "Suspend"}
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-500/30 transition-all duration-300 hover:scale-105"
                >
                    {translations.adminDelete || "Delete"}
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/40 border border-slate-700/60 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-slate-800/60 transition-all duration-300 hover:scale-105"
                >
                    {translations.adminClear || "Clear"}
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Users Table */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="overflow-x-auto">
              <div 
                className="max-h-[600px] sm:max-h-[700px] lg:max-h-[800px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-800/20 [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600/80"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(51, 65, 85, 0.6) rgba(15, 23, 42, 0.2)'
                }}
              >
            <table className="w-full min-w-0">
                  <thead className="bg-slate-800/60 border-b-2 border-slate-700/80 sticky top-0 z-20">
                <tr>
                      <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider sticky left-0 z-30">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-600/80 text-indigo-500 focus:ring-indigo-500 focus:ring-2 bg-slate-700/60 cursor-pointer"
                    />
                  </th>
                      <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[250px]">{translations.adminUser || "User"}</th>
                      <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell min-w-[150px]">{translations.adminSubscription || "Subscription"}</th>
                      <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden lg:table-cell min-w-[120px]">{translations.adminVideos || "Videos"}</th>
                      <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden lg:table-cell min-w-[140px]">{translations.adminTotalSpent || "Total Spent"}</th>
                      <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell min-w-[160px]">{translations.adminLastActive || "Last Active"}</th>
                </tr>
              </thead>
                  <tbody className="divide-y divide-slate-700/80 bg-slate-900/40">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-700/60">
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-slate-900/40 sticky left-0 z-10 border-r border-slate-700/60">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-800/60 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[250px]">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-slate-800/60 rounded-full animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="w-24 sm:w-32 h-4 sm:h-5 bg-slate-800/60 rounded animate-pulse"></div>
                            <div className="w-32 sm:w-48 h-3 sm:h-4 bg-slate-800/60 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden md:table-cell min-w-[150px]">
                        <div className="w-20 sm:w-24 h-6 sm:h-8 bg-slate-800/60 rounded-full animate-pulse"></div>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden lg:table-cell min-w-[120px]">
                        <div className="w-8 sm:w-12 h-4 sm:h-5 bg-slate-800/60 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden lg:table-cell min-w-[140px]">
                        <div className="w-16 sm:w-20 h-4 sm:h-5 bg-slate-800/60 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden md:table-cell min-w-[160px]">
                        <div className="w-20 sm:w-24 h-4 sm:h-5 bg-slate-800/60 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/60 transition-all duration-200 group border-b border-slate-700/60">
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-slate-900/40 sticky left-0 z-10 border-r border-slate-700/60">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-600/80 text-indigo-500 focus:ring-indigo-500 focus:ring-2 bg-slate-700/60 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[250px]">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-lg shadow-indigo-500/20 border-2 border-slate-700/40">
                            <span className="text-white text-sm sm:text-base lg:text-lg font-bold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate mb-0.5">{user.name}</p>
                            <p className="text-xs sm:text-sm lg:text-base text-white/70 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden md:table-cell min-w-[150px]">
                        <div>
                          {getSubscriptionBadge(user.subscription)}
                        </div>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden lg:table-cell min-w-[120px]">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-white block">{user.videosCreated}</span>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden lg:table-cell min-w-[140px]">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-white block">
                          ${user.totalSpent.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden md:table-cell min-w-[160px]">
                        <span className="text-xs sm:text-sm lg:text-base text-white/70 block">{user.lastActive}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
              </div>
            </div>
          </div>
          </div>
        </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Premium Users Card */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.adminPremiumUsers || "Premium Users"}</h3>
                    <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                      {loading ? "..." : premiumUsers}
                    </p>
                  </div>
                </div>
        <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-white/60">{translations.adminOfUsers || "of"} {totalUsers}</span>
                  <span className="text-xs sm:text-sm font-bold text-purple-400">
                    {totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-green-500/40 transition-all duration-300">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.adminTotalRevenue || "Total Revenue"}</h3>
                    <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent truncate">
                      {loading ? "..." : `$${totalRevenue.toFixed(2)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-white/60">{translations.adminFromUsers || "From users"}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{translations.adminQuickActions || "Quick Actions"}</h3>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => alert('Add user feature coming soon!')}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{translations.adminAddUser || "Add User"}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">{translations.adminCreateNewUser || "Create new user"}</p>
                  </div>
            </button>
                
                <button
                  onClick={() => fetchUsers()}
                  disabled={loading}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{loading ? (translations.adminRefreshing || "Refreshing...") : (translations.adminRefreshData || "Refresh Data")}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">{translations.adminUpdateList || "Update list"}</p>
                  </div>
            </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 lg:mt-8">
            <p className="text-sm sm:text-base text-white/60">
              {translations.adminShowingUsers || "Showing"} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {translations.adminOfUsers || "of"} {pagination.total} {translations.adminUsers || "users"}
            </p>
            {pagination.pages > 1 && (
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {translations.adminPrevious || "Previous"}
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-800/40 border border-slate-700/60 text-white hover:bg-slate-800/60 hover:scale-105'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {translations.adminNext || "Next"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-lg mx-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{translations.adminEditUser || "Edit User"}</h3>
                <button
                  onClick={handleCancelEdit}
                    className="p-2 sm:p-3 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

                <div className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">{translations.adminName || "Name"}</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                    <label className="block text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">{translations.adminEmail || "Email"}</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                    <label className="block text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">{translations.adminRole || "Role"}</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                    >
                      <option value="user">{translations.adminUserRole || "User"}</option>
                      <option value="admin">{translations.adminAdminRole || "Admin"}</option>
                      <option value="moderator">{translations.adminModeratorRole || "Moderator"}</option>
                  </select>
                </div>

                <div>
                    <label className="block text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">{translations.adminSubscription || "Subscription"}</label>
                  <select
                    value={editForm.subscription}
                    onChange={(e) => setEditForm(prev => ({ ...prev, subscription: e.target.value as any }))}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                    >
                      <option value="Free">{translations.adminFree || "Free"}</option>
                      <option value="Basic">{translations.adminBasic || "Basic"}</option>
                      <option value="Premium">{translations.adminPremium || "Premium"}</option>
                      <option value="Enterprise">{translations.adminEnterprise || "Enterprise"}</option>
                  </select>
                </div>
              </div>

                <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  onClick={handleSaveUser}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105"
                >
                    {translations.adminSaveChanges || "Save Changes"}
                </button>
                <button
                  onClick={handleCancelEdit}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl hover:bg-slate-800/60 transition-all duration-300 hover:scale-105"
                >
                    {translations.adminCancel || "Cancel"}
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
