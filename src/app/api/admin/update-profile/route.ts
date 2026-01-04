'use server'
import { NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Define a type matching your 'profile' table columns
type ProfileUpdate = {
  name: string
  bio?: string | null
  about?: string | null
  profile_pic?: string | null
}

export async function POST(request: Request) {
  try {
    // 1️⃣ Auth check using server-side anon client
    const supabase: SupabaseClient = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2️⃣ Admin client using SERVICE ROLE KEY
    const supabaseAdmin: SupabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 3️⃣ Parse form data
    const formData = await request.formData()
    const name = (formData.get('name') as string)?.trim()
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const bio = (formData.get('bio') as string)?.trim() || null
    const about = (formData.get('about') as string)?.trim() || null
    let profile_pic: string | null = null
    const file = formData.get('profile_pic') as File | null

    // 4️⃣ Upload profile picture (if provided)
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        )
      }

      const { data: urlData } = supabaseAdmin.storage
        .from('profiles')
        .getPublicUrl(fileName)

      profile_pic = urlData.publicUrl
    }

    // 5️⃣ Prepare typed update object
    const updateData: ProfileUpdate = { name }
    if (bio) updateData.bio = bio
    if (about) updateData.about = about
    if (profile_pic) updateData.profile_pic = profile_pic

    // 6️⃣ Update database
    const { error } = await supabaseAdmin
      .from('profile')
      .update(updateData)
      .eq('id', 1)

    if (error) {
      console.error('DB error:', error)
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  } catch (err) {
    console.error('Server route error:', err)
    return NextResponse.json(
      { error: 'Something went wrong on the server' },
      { status: 500 }
    )

  }

}

