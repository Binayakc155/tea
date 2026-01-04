import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/admin/login', request.url));

  const formData = await request.formData();
  const price = parseInt(formData.get('price') as string);

  const { error } = await supabase
    .from('settings')
    .update({ price_per_cup: price })
    .eq('id', 1);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
  }

  return NextResponse.redirect(new URL('/admin/dashboard', request.url));
}