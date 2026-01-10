'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Menu, X, BarChart3, Users, Settings, LogOut, Home } from 'lucide-react';
import ProfileForm from './ProfileForm';

export default function DashboardClient({ user, profile, settings, donations }: any) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  // Calculate statistics
  const totalDonations = donations?.length || 0;
  const totalTeaCups = donations?.reduce((sum: number, d: any) => sum + d.quantity, 0) || 0;
  const totalAmount = donations?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">☕</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manage your profile</h1>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Logged in as</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.email}</span>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <BarChart3 size={20} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Users size={20} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Settings size={20} />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'donations'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Home size={20} />
              Donations
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8">
          <div className="space-y-6">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Overview</h2>
                  <p className="text-gray-600 dark:text-gray-400"></p>
                </div>

                {/* Statistics Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Donations</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalDonations}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                    </div>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-4">↑ All time</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Tea Cups Sold</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalTeaCups}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-2xl">☕</div>
                    </div>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-4">↑ Total cups</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">Rs {(totalAmount / 100).toFixed(0)}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💰</span>
                      </div>
                    </div>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-4">↑ Revenue earned</p>
                  </div>
                </div>

                {/* Recent Donations */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Donations</h3>
                  {donations && donations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Cups</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.slice(0, 5).map((d: any) => (
                            <tr key={d.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                              <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{d.name}</td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{d.quantity}</td>
                              <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">Rs {(d.amount / 100).toFixed(2)}</td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">No donations yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                  <ProfileForm profile={profile} />
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Price Settings</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Configure the price per cup of tea</p>
                      <form action="/api/admin/update-price" method="post" className="flex flex-col md:flex-row gap-4 max-w-md">
                        <div className="flex-1">
                          <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300 text-sm">Price per cup (Rs)</label>
                          <input
                            name="price"
                            type="number"
                            defaultValue={settings?.price_per_cup || 50}
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
                            required
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            Update Price
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">All Donations</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                  {donations && donations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Quantity</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Message</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((d: any) => (
                            <tr key={d.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                              <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{d.name}</td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{d.quantity}</td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{d.message || '-'}</td>
                              <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">Rs {(d.amount / 100).toFixed(2)}</td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{new Date(d.created_at).toLocaleString()}</td>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
