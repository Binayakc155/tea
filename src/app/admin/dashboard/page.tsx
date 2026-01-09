// src/app/admin/dashboard/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';
import DashboardClient from './DashboardClient'

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <DashboardClient user={user} profile={profile} settings={settings} donations={donations} />
  );
}
