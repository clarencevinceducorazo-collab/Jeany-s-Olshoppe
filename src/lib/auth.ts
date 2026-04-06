import { createClient } from './supabase/client'

export async function signInWithFacebook() {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  })
  if (error) throw error
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  })
  if (error) throw error
}
