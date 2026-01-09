'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import ProfileForm from './ProfileForm';

export default function DashboardClient({ user, profile, settings, donations }: any) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('admin-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, <span className="font-semibold text-gray-800 dark:text-gray-200">{user.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Profile Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-8 transition-colors duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Profile</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update your profile information</p>
          </div>
          <ProfileForm profile={profile} />
        </div>

        {/* Price Settings Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-8 transition-colors duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Price Settings</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage the price per cup</p>
          </div>
          <form
            action="/api/admin/update-price"
            method="post"
            className="flex flex-col md:flex-row items-start md:items-end gap-4 max-w-md"
          >
            <div className="flex-1 w-full">
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">Price per cup (Rs)</label>
              <input
                name="price"
                type="number"
                defaultValue={settings?.price_per_cup || 50}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Update Price
            </button>
          </form>
        </div>

        {/* Donations Table Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-8 transition-colors duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Donations</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Total: <span className="font-semibold text-blue-600 dark:text-blue-400">{donations?.length || 0}</span> donations
            </p>
          </div>
          {donations && donations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Quantity</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Message</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Amount (Rs)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d: any) => (
                    <tr key={d.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{d.name}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{d.quantity}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{d.message || '-'}</td>
                      <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">Rs {(d.amount / 100).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{new Date(d.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No donations yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
