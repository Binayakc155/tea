
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient(); // ✅ await here
  await supabase.auth.signOut(); // ✅ works now
  return NextResponse.redirect(
    new URL('/', request.url)
  );
}

