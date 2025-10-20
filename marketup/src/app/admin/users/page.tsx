"use client";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastActive: string;
  subscription: "Basic" | "Premium" | "Enterprise";
  videosCreated: number;
  totalSpent: number;
  avatar?: string;
}

interface EditUserData {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  subscription: "Basic" | "Premium" | "Enterprise";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubscription, setFilterSubscription] = useState("all");
  const [sortBy, setSortBy] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserData>({
    name: "",
    email: "",
    role: "",
    status: "active",
    subscription: "Basic"
  });
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers([
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "user",
          status: "active",
          joinDate: "2024-01-15",
          lastActive: "2024-01-20",
          subscription: "Premium",
          videosCreated: 12,
          totalSpent: 299.00
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "user",
          status: "active",
          joinDate: "2024-01-10",
          lastActive: "2024-01-19",
          subscription: "Basic",
          videosCreated: 5,
          totalSpent: 99.00
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          role: "user",
          status: "suspended",
          joinDate: "2024-01-05",
          lastActive: "2024-01-18",
          subscription: "Premium",
          videosCreated: 8,
          totalSpent: 299.00
        },
        {
          id: "4",
          name: "Sarah Wilson",
          email: "sarah.wilson@example.com",
          role: "user",
          status: "inactive",
          joinDate: "2024-01-01",
          lastActive: "2024-01-15",
          subscription: "Basic",
          videosCreated: 3,
          totalSpent: 99.00
        },
        {
          id: "5",
          name: "Alex Brown",
          email: "alex.brown@example.com",
          role: "user",
          status: "active",
          joinDate: "2024-01-12",
          lastActive: "2024-01-20",
          subscription: "Enterprise",
          videosCreated: 25,
          totalSpent: 999.00
        },
        {
          id: "6",
          name: "Emma Davis",
          email: "emma.davis@example.com",
          role: "user",
          status: "active",
          joinDate: "2024-01-08",
          lastActive: "2024-01-19",
          subscription: "Premium",
          videosCreated: 15,
          totalSpent: 299.00
        }
      ]);
      setLoading(false);
    };

    fetchUsers();
  }, []);

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
      status: user.status,
      subscription: user.subscription
    });
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    setUsers(prev => prev.map(user => 
      user.id === editingUser.id 
        ? { ...user, ...editForm }
        : user
    ));
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      name: "",
      email: "",
      role: "",
      status: "active",
      subscription: "Basic"
    });
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on users:`, selectedUsers);
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatusFilter = filterStatus === "all" || user.status === filterStatus;
      const matchesSubscriptionFilter = filterSubscription === "all" || user.subscription === filterSubscription;
      return matchesSearch && matchesStatusFilter && matchesSubscriptionFilter;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "joinDate":
          aValue = new Date(a.joinDate).getTime();
          bValue = new Date(b.joinDate).getTime();
          break;
        case "lastActive":
          aValue = new Date(a.lastActive).getTime();
          bValue = new Date(b.lastActive).getTime();
          break;
        case "videosCreated":
          aValue = a.videosCreated;
          bValue = b.videosCreated;
          break;
        case "totalSpent":
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-success/10 text-success border-success/20",
      inactive: "bg-warning/10 text-warning border-warning/20",
      suspended: "bg-error/10 text-error border-error/20"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSubscriptionBadge = (subscription: string) => {
    const styles = {
      Premium: "bg-accent/10 text-accent border-accent/20",
      Basic: "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[subscription as keyof typeof styles]}`}>
        {subscription}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-foreground-muted mt-2">Manage platform users and their accounts</p>
        </div>
        <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors">
          Add User
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="glass-elevated rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={filterSubscription}
            onChange={(e) => setFilterSubscription(e.target.value)}
            className="px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">All Subscriptions</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="joinDate">Sort by Join Date</option>
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="lastActive">Sort by Last Active</option>
              <option value="videosCreated">Sort by Videos</option>
              <option value="totalSpent">Sort by Total Spent</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 bg-surface-elevated border border-border rounded-lg hover:bg-surface transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted">
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
          <div className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <span className="text-sm text-foreground">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-success/10 text-success border border-success/20 rounded text-sm hover:bg-success/20 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded text-sm hover:bg-warning/20 transition-colors"
              >
                Suspend
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-error/10 text-error border border-error/20 rounded text-sm hover:bg-error/20 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 bg-surface-elevated border border-border rounded text-sm hover:bg-surface transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="glass-elevated rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-elevated border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-border-strong text-accent focus:ring-accent focus:ring-1"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Videos</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-elevated rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-surface-elevated rounded animate-pulse"></div>
                          <div className="w-32 h-3 bg-surface-elevated rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-6 bg-surface-elevated rounded-full animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-6 bg-surface-elevated rounded-full animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-8 h-4 bg-surface-elevated rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-4 bg-surface-elevated rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-8 bg-surface-elevated rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-elevated transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="w-4 h-4 rounded border-border-strong text-accent focus:ring-accent focus:ring-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-foreground-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getSubscriptionBadge(user.subscription)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">{user.videosCreated}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground font-medium">
                        ${user.totalSpent.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground-muted">{user.lastActive}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <p className="text-sm text-foreground-muted">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground hover:bg-surface transition-colors">
            Previous
          </button>
          <button className="px-3 py-2 bg-accent text-white rounded-lg text-sm">
            1
          </button>
          <button className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground hover:bg-surface transition-colors">
            2
          </button>
          <button className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground hover:bg-surface transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Edit User</h3>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subscription</label>
                <select
                  value={editForm.subscription}
                  onChange={(e) => setEditForm(prev => ({ ...prev, subscription: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-surface-elevated border border-border text-foreground rounded-lg text-sm font-medium hover:bg-surface transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
