// /api/admin/update-profile/route.ts
import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type ProfileUpdate = {
  name: string;
  bio?: string | null;
  about?: string | null;
  profile_pic?: string | null;
};

// Configure to allow larger payloads and increase timeout
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max

export async function POST(request: Request) {
  try {
    // Server-side auth
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Admin client
    const supabaseAdmin: SupabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Parse form
    const formData = await request.formData();
    const name = (formData.get('name') as string)?.trim();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const bio = (formData.get('bio') as string)?.trim() || null;
    const about = (formData.get('about') as string)?.trim() || null;

    let profile_pic: string | null = null;
    const file = formData.get('profile_pic') as File | null;

    // Upload file if exists
    if (file && file.size > 0) {
      // Check file size (limit to 5MB for Vercel)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large. Max size is 5MB' }, { status: 400 });
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Convert File to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from('profiles')
        .upload(fileName, buffer, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload image: ' + uploadError.message }, { status: 500 });
      }

      const { data: urlData } = supabaseAdmin.storage.from('profiles').getPublicUrl(fileName);
      profile_pic = urlData.publicUrl;
    }

    // Update DB
    const updateData: ProfileUpdate = { name, bio, about };
    if (profile_pic) updateData.profile_pic = profile_pic;

    const { error } = await supabaseAdmin.from('profile').update(updateData).eq('id', 1);
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to update profile: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Profile updated!' });
  } catch (err) {
    console.error('Server error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Server error: ' + errorMessage }, { status: 500 });
  }
}
