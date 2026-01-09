// src/app/admin/dashboard/ProfileForm.tsx
'use client'

import { useState, useEffect } from 'react';

export default function ProfileForm({ profile }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    
    // Validate file size on client side
    const fileInput = formData.get('profile_pic') as File | null;
    if (fileInput && fileInput.size > 0) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (fileInput.size > maxSize) {
        setError('File size must be less than 5MB');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/admin/update-profile', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-6 max-w-3xl"
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in transition-colors">
          <span className="text-red-600 dark:text-red-400 mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in transition-colors">
          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
          <span>{success}</span>
        </div>
      )}

      <div>
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Name *</label>
        <input
          name="name"
          defaultValue={profile?.name}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
          required
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
        <input
          name="bio"
          defaultValue={profile?.bio}
          placeholder="Add a short bio"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">About</label>
        <textarea
          name="about"
          defaultValue={profile?.about}
          rows={5}
          placeholder="Tell more about yourself or your services"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500 resize-vertical"
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
        <div className="relative">
          <input
            type="file"
            name="profile_pic"
            accept="image/*"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700 file:transition-colors file:cursor-pointer text-gray-700 dark:text-gray-300 dark:file:bg-blue-700 dark:file:hover:bg-blue-800"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {profile?.profile_pic ? '📷 Profile picture already uploaded' : '📁 No profile picture yet'}
        </p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            'Save Profile'
          )}
        </button>
      </div>
    </form>
  );
}
