// src/app/admin/dashboard/ProfileForm.tsx
'use client'

import { useState } from 'react';

export default function ProfileForm({ profile }: any) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/admin/update-profile', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) alert(data.message);
      else alert('Error: ' + data.error);
    } catch (err) {
      console.error(err);
      alert('Server error');
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
          className="w-full p-3 border rounded"
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
