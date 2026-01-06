// src/app/admin/dashboard/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm'; // We'll create this client component next

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  // 1️⃣ Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login'); // redirect if not logged in

  // 2️⃣ Fetch profile, settings, donations
  const { data: profile } = await supabase.from('profile').select('*').eq('id', 1).single();
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();
  const { data: donations } = await supabase.from('donations').select('*').order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-500 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="mb-8">Welcome back, {user.email}</p>

          {/* Profile Form */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <ProfileForm profile={profile} />
          </div>

          {/* Price Update Form */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Price Settings</h2>
            <form
              action="/api/admin/update-price"
              method="post"
              className="flex items-end gap-4 max-w-md"
            >
              <div className="flex-1">
                <label className="block font-medium mb-2">Price per cup (Rs)</label>
                <input
                  name="price"
                  type="number"
                  defaultValue={settings?.price_per_cup || 50}
                  min="1"
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
              >
                Update Price
              </button>
            </form>
          </div>

          {/* Donations Table */}
          <div>
            <h2 className="text-2xl font-bold mb-6">All Donations ({donations?.length || 0})</h2>
            {donations && donations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-3 text-left">Name</th>
                      <th className="border p-3 text-left">Quantity</th>
                      <th className="border p-3 text-left">Message</th>
                      <th className="border p-3 text-left">Amount (Rs)</th>
                      <th className="border p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d: any) => (
                      <tr key={d.id}>
                        <td className="border p-3">{d.name}</td>
                        <td className="border p-3">{d.quantity}</td>
                        <td className="border p-3">{d.message || '-'}</td>
                        <td className="border p-3">{(d.amount / 100).toFixed(2)}</td>
                        <td className="border p-3">{new Date(d.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No donations yet.</p>
            )}
          </div>

          {/* Logout */}
          <form action="/api/auth/logout" method="post" className="mt-12">
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
