
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient(); // ✅ await here
  await supabase.auth.signOut(); // ✅ works now
  // Use 303 See Other so browsers follow with a GET
  return NextResponse.redirect(new URL('/', request.url), 303);
}

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  // Also redirect with 303 for GET access (link clicks)
  return NextResponse.redirect(new URL('/', request.url), 303);
}

