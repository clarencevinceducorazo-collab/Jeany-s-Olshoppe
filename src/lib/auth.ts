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
