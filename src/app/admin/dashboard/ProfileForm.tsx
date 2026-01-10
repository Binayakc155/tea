// src/app/admin/dashboard/ProfileForm.tsx
'use client'

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Upload } from 'lucide-react';

export default function ProfileForm({ profile }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      className="space-y-8"
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 px-6 py-4 rounded-lg flex items-start gap-3 animate-in fade-in transition-all">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-400">Error</h3>
            <p className="text-red-800 dark:text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 px-6 py-4 rounded-lg flex items-start gap-3 animate-in fade-in transition-all">
          <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-400">Success</h3>
            <p className="text-green-800 dark:text-green-300 text-sm mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl p-6 border border-blue-200 dark:border-slate-600">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile Picture</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Image Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Current Picture</p>
            <div className="w-full h-48 bg-gray-200 dark:bg-slate-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : profile?.profile_pic ? (
                <img src={profile.profile_pic} alt="Current" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">📷</span>
              )}
            </div>
          </div>

          {/* Upload Input */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Upload New Picture</p>
            <label className="block w-full">
              <input
                type="file"
                name="profile_pic"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="w-full h-48 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-center">
                <div className="text-center">
                  <Upload className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={32} />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF (max 5MB)</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            defaultValue={profile?.name}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Bio</label>
          <input
            name="bio"
            type="text"
            defaultValue={profile?.bio}
            placeholder="Add a short bio (e.g., 'CS Student' or 'Creator')"
            maxLength={100}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Max 100 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">About</label>
          <textarea
            name="about"
            rows={5}
            defaultValue={profile?.about}
            placeholder="Tell more about yourself, your work, or what you do..."
            maxLength={500}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500 resize-vertical"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Max 500 characters</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving Changes...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Save Profile
            </>
          )}
        </button>
        <button
          type="reset"
          className="px-6 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
