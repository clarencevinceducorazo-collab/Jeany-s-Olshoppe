import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  
  // Check if Supabase or Facebook attached error parameters to the URL
  const authError = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (authError || errorDescription) {
    console.error('OAuth Error Redirected from Supabase:', authError, errorDescription)
    // Redirect to login with the error visible in the URL bar
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || authError || 'Unknown error')}`)
  }
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Supabase Auth Callback Error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
    }
  } else {
    console.warn('No code provided in auth callback URL!')
  }
  
  return NextResponse.redirect(`${origin}${next}`)
}
