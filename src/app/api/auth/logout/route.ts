
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createServerSupabaseClient(); // ✅ await here
  await supabase.auth.signOut(); // ✅ works now
  return NextResponse.redirect(
    new URL(
      '/admin/login',
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    )
  );
}

