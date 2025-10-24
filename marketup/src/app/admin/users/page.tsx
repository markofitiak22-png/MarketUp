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

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users data...');
      
      const params = new URLSearchParams({
        search: searchTerm,
        subscription: filterSubscription,
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/admin/users?${params}`);
      console.log('Users API response status:', response.status);
      
      const data = await response.json();
      console.log('Users API response data:', data);
      
      if (data.success) {
        setUsers(data.data.users);
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
    fetchUsers();
  }, [searchTerm, filterSubscription, sortBy, sortOrder]);

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
        body: JSON.stringify({
          userId: editingUser.id,
          updates: editForm
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh users list
        fetchUsers();
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
          body: JSON.stringify({
            userIds: [userId]
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert(`User deleted successfully!`);
          fetchUsers(); // Refresh the list
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
          body: JSON.stringify({
            userIds: selectedUsers
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert(`${selectedUsers.length} ${translations.adminUsersDeletedSuccessfully}`);
          fetchUsers(); // Refresh the list
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

  const getSubscriptionBadge = (subscription: string) => {
    const styles = {
      Premium: "bg-accent/10 text-accent border-accent/20",
      Basic: "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20",
      Enterprise: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Free: "bg-gray-500/10 text-gray-500 border-gray-500/20"
    };
    
    return (
      <span className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold border ${styles[subscription as keyof typeof styles] || styles.Free}`}>
        {subscription}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 space-y-8 max-w-full overflow-x-hidden">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12 max-w-full overflow-hidden">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent mb-4 sm:mb-6">
            {translations.adminUsersManagement}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed px-4">
            {translations.adminUsersManagementDescription}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <button className="btn-primary px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl font-bold hover:scale-105 transition-all duration-300">
            {translations.adminAddUser}
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group max-w-full overflow-hidden">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 sm:w-6 sm:h-6 lg:w-8 lg:h-8">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">{translations.adminSearchFilters}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted sm:w-5 sm:h-5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder={translations.adminSearchUsers}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-surface-elevated border border-border rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              />
            </div>

            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value)}
              className="px-4 sm:px-6 py-3 sm:py-4 bg-surface-elevated border border-border rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
            >
              <option value="all">{translations.adminAllSubscriptions}</option>
              <option value="Free">{translations.adminFree}</option>
              <option value="Basic">{translations.adminBasic}</option>
              <option value="Premium">{translations.adminPremium}</option>
              <option value="Enterprise">{translations.adminEnterprise}</option>
            </select>

            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-surface-elevated border border-border rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="joinDate">{translations.adminSortByJoinDate}</option>
                <option value="name">{translations.adminSortByName}</option>
                <option value="email">{translations.adminSortByEmail}</option>
                <option value="lastActive">{translations.adminSortByLastActive}</option>
                <option value="videosCreated">{translations.adminSortByVideos}</option>
                <option value="totalSpent">{translations.adminSortByTotalSpent}</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-3 sm:p-4 bg-surface-elevated border border-border rounded-xl sm:rounded-2xl hover:bg-surface transition-all duration-300 hover:scale-105"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted sm:w-5 sm:h-5">
                  {sortOrder === "asc" ? (
                    <path d="M3 6h18M7 12h10M10 18h4"/>
                  ) : (
                    <path d="M3 18h18M7 12h10M10 6h4"/>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-accent/5 border border-accent/20 rounded-xl sm:rounded-2xl">
              <span className="text-base sm:text-lg font-bold text-foreground">
                {selectedUsers.length} {selectedUsers.length !== 1 ? translations.adminUsersSelected : translations.adminUserSelected}
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-success/10 text-success border border-success/20 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg font-bold hover:bg-success/20 transition-all duration-300 hover:scale-105"
                >
                  {translations.adminActivate}
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-warning/10 text-warning border border-warning/20 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg font-bold hover:bg-warning/20 transition-all duration-300 hover:scale-105"
                >
                  {translations.adminSuspend}
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-error/10 text-error border border-error/20 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg font-bold hover:bg-error/20 transition-all duration-300 hover:scale-105"
                >
                  {translations.adminDelete}
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-surface-elevated border border-border rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg font-bold hover:bg-surface transition-all duration-300 hover:scale-105"
                >
                  {translations.adminClear}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group max-w-full">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full min-w-0">
              <thead className="bg-surface-elevated border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-foreground-muted uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-border-strong text-accent focus:ring-accent focus:ring-2"
                    />
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-foreground-muted uppercase tracking-wider">{translations.adminUser}</th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-foreground-muted uppercase tracking-wider hidden md:table-cell">{translations.adminSubscription}</th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-foreground-muted uppercase tracking-wider hidden lg:table-cell">{translations.adminVideos}</th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-foreground-muted uppercase tracking-wider hidden lg:table-cell">{translations.adminTotalSpent}</th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-foreground-muted uppercase tracking-wider hidden md:table-cell">{translations.adminLastActive}</th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-foreground-muted uppercase tracking-wider">{translations.adminActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-surface-elevated rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-surface-elevated rounded-full animate-pulse"></div>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="w-24 sm:w-32 h-4 sm:h-5 bg-surface-elevated rounded animate-pulse"></div>
                            <div className="w-32 sm:w-48 h-3 sm:h-4 bg-surface-elevated rounded animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hidden md:table-cell">
                        <div className="w-20 sm:w-24 h-6 sm:h-8 bg-surface-elevated rounded-full animate-pulse"></div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hidden lg:table-cell">
                        <div className="w-8 sm:w-12 h-4 sm:h-5 bg-surface-elevated rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hidden lg:table-cell">
                        <div className="w-16 sm:w-20 h-4 sm:h-5 bg-surface-elevated rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hidden md:table-cell">
                        <div className="w-20 sm:w-24 h-4 sm:h-5 bg-surface-elevated rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="w-4 h-4 bg-surface-elevated rounded animate-pulse"></div>
                          <div className="w-4 h-4 bg-surface-elevated rounded animate-pulse"></div>
                          <div className="w-4 h-4 bg-surface-elevated rounded animate-pulse"></div>
                          <div className="w-4 h-4 bg-surface-elevated rounded animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-elevated transition-all duration-300 hover:scale-[1.01] group">
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded border-border-strong text-accent focus:ring-accent focus:ring-2"
                        />
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-0 min-w-0">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                            <span className="text-white text-sm sm:text-base lg:text-lg font-bold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">{user.name}</p>
                            <p className="text-xs sm:text-sm lg:text-base text-foreground-muted truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hidden md:table-cell max-w-0 min-w-0">
                        <div className="truncate">
                          {getSubscriptionBadge(user.subscription)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hidden lg:table-cell max-w-0 min-w-0">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate block">{user.videosCreated}</span>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hidden lg:table-cell max-w-0 min-w-0">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate block">
                          ${user.totalSpent.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 hidden md:table-cell max-w-0 min-w-0">
                        <span className="text-xs sm:text-sm lg:text-base text-foreground-muted truncate block">{user.lastActive}</span>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-0 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-1.5 sm:p-2 lg:p-3 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105"
                            title="Edit user"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleUserAction(user.id, 'view')}
                            className="p-1.5 sm:p-2 lg:p-3 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105"
                            title="View user details"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="p-1.5 sm:p-2 lg:p-3 text-foreground-muted hover:text-warning hover:bg-warning/10 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105"
                            title="Suspend user"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path d="M18 6L6 18"/>
                              <path d="M6 6l12 12"/>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="p-1.5 sm:p-2 lg:p-3 text-foreground-muted hover:text-error hover:bg-error/10 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105"
                            title="Delete user"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path d="M3 6h18"/>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-lg text-foreground-muted">
            {translations.adminShowingUsers} {filteredUsers.length} {translations.adminOfUsers} {users.length} users
          </p>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-surface-elevated border border-border rounded-xl text-lg font-bold text-foreground hover:bg-surface transition-all duration-300 hover:scale-105">
              {translations.adminPrevious}
            </button>
            <button className="px-6 py-3 bg-accent text-white rounded-xl text-lg font-bold hover:scale-105 transition-all duration-300">
              1
            </button>
            <button className="px-6 py-3 bg-surface-elevated border border-border rounded-xl text-lg font-bold text-foreground hover:bg-surface transition-all duration-300 hover:scale-105">
              2
            </button>
            <button className="px-6 py-3 bg-surface-elevated border border-border rounded-xl text-lg font-bold text-foreground hover:bg-surface transition-all duration-300 hover:scale-105">
              {translations.adminNext}
            </button>
          </div>
        </div>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-elevated rounded-3xl p-10 w-full max-w-lg mx-4 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-foreground">{translations.adminEditUser}</h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-3 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-xl transition-all duration-300 hover:scale-110"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-foreground mb-3">{translations.adminName}</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-6 py-4 bg-surface-elevated border border-border rounded-2xl text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-foreground mb-3">{translations.adminEmail}</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-6 py-4 bg-surface-elevated border border-border rounded-2xl text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-foreground mb-3">{translations.adminRole}</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-6 py-4 bg-surface-elevated border border-border rounded-2xl text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  >
                    <option value="user">{translations.adminUserRole}</option>
                    <option value="admin">{translations.adminAdminRole}</option>
                    <option value="moderator">{translations.adminModeratorRole}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-foreground mb-3">{translations.adminSubscription}</label>
                  <select
                    value={editForm.subscription}
                    onChange={(e) => setEditForm(prev => ({ ...prev, subscription: e.target.value as any }))}
                    className="w-full px-6 py-4 bg-surface-elevated border border-border rounded-2xl text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  >
                    <option value="Free">{translations.adminFree}</option>
                    <option value="Basic">{translations.adminBasic}</option>
                    <option value="Premium">{translations.adminPremium}</option>
                    <option value="Enterprise">{translations.adminEnterprise}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={handleSaveUser}
                  className="flex-1 px-8 py-4 bg-accent text-white rounded-2xl text-lg font-bold hover:bg-accent-hover transition-all duration-300 hover:scale-105"
                >
                  {translations.adminSaveChanges}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-8 py-4 bg-surface-elevated border border-border text-foreground rounded-2xl text-lg font-bold hover:bg-surface transition-all duration-300 hover:scale-105"
                >
                  {translations.adminCancel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}