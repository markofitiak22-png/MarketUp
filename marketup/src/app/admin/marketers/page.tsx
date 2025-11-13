"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface TieredCommission {
  userCount: number;
  percentage: number;
}

interface Marketer {
  id: string;
  name: string;
  code: string;
  baseCommissionPercentage: number;
  tieredCommissions: TieredCommission[] | null;
  isActive: boolean;
  createdAt: string;
  stats: {
    totalReferrals: number;
    totalCommission: number;
    paidCommission: number;
    pendingCommission: number;
  };
}

export default function MarketersPage() {
  const { translations } = useTranslations();
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMarketer, setEditingMarketer] = useState<Marketer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    baseCommissionPercentage: 6,
    tieredCommissions: [] as TieredCommission[],
  });

  // Fetch marketers
  const fetchMarketers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/marketers", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setMarketers(data.data);
      } else {
        console.error("Failed to fetch marketers:", data.error);
        alert("Failed to load marketers");
      }
    } catch (error) {
      console.error("Error fetching marketers:", error);
      alert("Error loading marketers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketers();
  }, []);

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingMarketer
        ? "/api/admin/marketers"
        : "/api/admin/marketers";
      const method = editingMarketer ? "PUT" : "POST";

      const body = editingMarketer
        ? {
            id: editingMarketer.id,
            ...formData,
            tieredCommissions:
              formData.tieredCommissions.length > 0
                ? formData.tieredCommissions
                : null,
          }
        : {
            ...formData,
            tieredCommissions:
              formData.tieredCommissions.length > 0
                ? formData.tieredCommissions
                : null,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          editingMarketer
            ? "Marketer updated successfully!"
            : "Marketer created successfully!"
        );
        setShowCreateModal(false);
        setEditingMarketer(null);
        setFormData({
          name: "",
          code: "",
          baseCommissionPercentage: 6,
          tieredCommissions: [],
        });
        fetchMarketers();
      } else {
        alert("Failed: " + data.error);
      }
    } catch (error) {
      console.error("Error saving marketer:", error);
      alert("Error saving marketer");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this marketer?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/marketers?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || "Marketer deleted successfully!");
        fetchMarketers();
      } else {
        alert("Failed to delete: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting marketer:", error);
      alert("Error deleting marketer");
    }
  };

  // Handle toggle active
  const handleToggleActive = async (marketer: Marketer) => {
    try {
      const response = await fetch("/api/admin/marketers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: marketer.id,
          isActive: !marketer.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchMarketers();
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (error) {
      console.error("Error updating marketer:", error);
      alert("Error updating marketer");
    }
  };

  // Add tiered commission
  const addTieredCommission = () => {
    setFormData({
      ...formData,
      tieredCommissions: [
        ...formData.tieredCommissions,
        { userCount: 5, percentage: 10 },
      ],
    });
  };

  // Remove tiered commission
  const removeTieredCommission = (index: number) => {
    setFormData({
      ...formData,
      tieredCommissions: formData.tieredCommissions.filter((_, i) => i !== index),
    });
  };

  // Update tiered commission
  const updateTieredCommission = (
    index: number,
    field: "userCount" | "percentage",
    value: number
  ) => {
    const updated = [...formData.tieredCommissions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, tieredCommissions: updated });
  };

  // Start editing
  const startEdit = (marketer: Marketer) => {
    setEditingMarketer(marketer);
    setFormData({
      name: marketer.name,
      code: marketer.code,
      baseCommissionPercentage: marketer.baseCommissionPercentage,
      tieredCommissions:
        (marketer.tieredCommissions as TieredCommission[]) || [],
    });
    setShowCreateModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      baseCommissionPercentage: 6,
      tieredCommissions: [],
    });
    setEditingMarketer(null);
    setShowCreateModal(false);
  };

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
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
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="hidden sm:flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>
                {translations.adminSidebarMarketers || "Marketers"}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              {translations.adminSidebarMarketers || "Marketers"}
            </h1>
            <p className="text-sm sm:text-base text-white/60">
              Manage marketer codes and commission rates
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Marketer
          </button>
        </div>

        {/* Marketers List */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          {marketers.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">
                No marketers yet
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-white/60 mb-4 sm:mb-6">
                Create your first marketer to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {marketers.map((marketer) => (
                <div
                  key={marketer.id}
                  className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 sm:p-6 hover:border-indigo-500/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          {marketer.name}
                        </h3>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                            marketer.isActive
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                          }`}
                        >
                          {marketer.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-white/60">
                          <span className="font-semibold">Code:</span>{" "}
                          <code className="px-2 py-1 bg-slate-900/60 rounded text-indigo-400">
                            {marketer.code}
                          </code>
                        </p>
                        <p className="text-sm text-white/60">
                          <span className="font-semibold">Base Commission:</span>{" "}
                          {marketer.baseCommissionPercentage}%
                        </p>
                        {marketer.tieredCommissions &&
                          marketer.tieredCommissions.length > 0 && (
                            <div className="text-sm text-white/60">
                              <span className="font-semibold">Tiered Commissions:</span>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {marketer.tieredCommissions.map((tier, idx) => (
                                  <li key={idx}>
                                    {tier.percentage}% after {tier.userCount} users
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3">
                          <div>
                            <p className="text-xs text-white/60">Referrals</p>
                            <p className="text-sm sm:text-base font-bold text-white">
                              {marketer.stats.totalReferrals}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">Total Commission</p>
                            <p className="text-sm sm:text-base font-bold text-green-400">
                              {formatCurrency(marketer.stats.totalCommission)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">Paid</p>
                            <p className="text-sm sm:text-base font-bold text-blue-400">
                              {formatCurrency(marketer.stats.paidCommission)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">Pending</p>
                            <p className="text-sm sm:text-base font-bold text-yellow-400">
                              {formatCurrency(marketer.stats.pendingCommission)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(marketer)}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                          marketer.isActive
                            ? "bg-slate-700/60 hover:bg-slate-700 text-white"
                            : "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                        }`}
                      >
                        {marketer.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => startEdit(marketer)}
                        className="px-3 sm:px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-xs sm:text-sm font-semibold border border-indigo-500/30 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(marketer.id)}
                        className="px-3 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs sm:text-sm font-semibold border border-red-500/30 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetForm();
            }
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="p-4 sm:p-6 border-b border-slate-700/60">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {editingMarketer ? "Edit Marketer" : "Create Marketer"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-bold text-white mb-2">
                  Marketer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="e.g., Rami"
                />
              </div>

              {!editingMarketer && (
                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-2">
                    Code (optional - auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    placeholder="Leave empty to auto-generate"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm sm:text-base font-bold text-white mb-2">
                  Base Commission Percentage *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.baseCommissionPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      baseCommissionPercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="e.g., 6"
                />
                <p className="text-xs text-white/60 mt-1">
                  Default commission for each referred user
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm sm:text-base font-bold text-white">
                    Tiered Commissions (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addTieredCommission}
                    className="px-3 py-1.5 text-xs sm:text-sm bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg border border-indigo-500/30 transition-all"
                  >
                    + Add Tier
                  </button>
                </div>
                <p className="text-xs text-white/60 mb-3">
                  Set higher commission rates based on number of users (e.g., 10%
                  after 5 users)
                </p>
                {formData.tieredCommissions.map((tier, index) => (
                  <div
                    key={index}
                    className="flex gap-2 mb-2 p-3 bg-slate-800/40 rounded-lg border border-slate-700/60"
                  >
                    <div className="flex-1">
                      <label className="block text-xs text-white/60 mb-1">
                        After how many users?
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tier.userCount}
                        onChange={(e) =>
                          updateTieredCommission(
                            index,
                            "userCount",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1.5 rounded border border-slate-700/60 bg-slate-900/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-white/60 mb-1">
                        Commission %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={tier.percentage}
                        onChange={(e) =>
                          updateTieredCommission(
                            index,
                            "percentage",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1.5 rounded border border-slate-700/60 bg-slate-900/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTieredCommission(index)}
                      className="px-3 py-1.5 text-red-400 hover:bg-red-500/20 rounded border border-red-500/30 transition-all self-end"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all font-semibold shadow-lg shadow-indigo-500/20"
                >
                  {editingMarketer ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

