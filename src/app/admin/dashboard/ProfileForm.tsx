// src/app/admin/dashboard/ProfileForm.tsx
'use client'

import { useState } from 'react';

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
      className="space-y-6 max-w-2xl"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div>
        <label className="block font-medium mb-2">Name*</label>
        <input
          name="name"
          defaultValue={profile?.name}
          className="w-full p-3 border rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Bio</label>
        <input
          name="bio"
          defaultValue={profile?.bio}
          className="w-full p-3 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">About</label>
        <textarea
          name="about"
          defaultValue={profile?.about}
          rows={5}
          className="w-full p-3 border rounded"S
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Profile Picture</label>
        <input
          type="file"
          name="profile_pic"
          accept="image/*"
          className="w-full p-3 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <p className="text-sm text-gray-600 mt-2">
          Current: {profile?.profile_pic ? 'Uploaded' : 'None'}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
