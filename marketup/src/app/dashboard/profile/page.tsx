"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    bio: "",
    company: "",
    website: "",
  });

  const handleSave = () => {
    // TODO: Implement profile update API
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-elevated rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
            <span className="text-2xl font-semibold text-white">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-foreground-muted">Manage your account information and preferences</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline px-4 py-2"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="glass-elevated rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Personal Information</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none opacity-50 cursor-not-allowed"
                placeholder="Enter your email"
              />
              <p className="text-xs text-foreground-muted mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Your company name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary px-6 py-3"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-outline px-6 py-3"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Settings */}
      <div className="glass-elevated rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Account Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Change Password</h3>
              <p className="text-sm text-foreground-muted">Update your password to keep your account secure</p>
            </div>
            <button className="btn-outline px-4 py-2">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
              <p className="text-sm text-foreground-muted">Add an extra layer of security to your account</p>
            </div>
            <button className="btn-outline px-4 py-2">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Delete Account</h3>
              <p className="text-sm text-foreground-muted">Permanently delete your account and all data</p>
            </div>
            <button className="text-error hover:text-error/80 px-4 py-2 border border-error/20 rounded-lg hover:bg-error/10 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
