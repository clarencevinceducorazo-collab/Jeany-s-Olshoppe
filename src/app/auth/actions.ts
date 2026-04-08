'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Welcome back' }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string
  const firstName = formData.get('first_name') as string || ''
  const lastName = formData.get('last_name') as string || ''
  const location = formData.get('location') as string || ''

  if (!email || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' }
  }

  const supabase = await createClient()
  const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        location: location,
      }
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }
  
  if (data?.user?.id) {
    // Insert safely into our new people table
    const { error: profileError } = await supabase.from('people').insert({
      id: data.user.id,
      email: data.user.email,
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`.trim(),
      location: location,
      role: 'user'
    })
    
    if (profileError) {
      console.error("People insert error:", profileError)
      // Usually fails if trigger already runs, or constraints, but we can suppress
    }
  }

  return { success: true, message: 'Check your email to continue sign in process' }
}
