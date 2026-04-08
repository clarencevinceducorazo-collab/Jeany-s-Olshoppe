import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type UserRole = 'user' | 'admin' | 'super_admin' | null

export async function getUserRole(): Promise<UserRole> {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} 
      }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user || authError) {
      return null
    }

    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      
    if (dbError) {
       return 'user';
    }

    return (profile?.role as UserRole) ?? 'user'
  } catch (err) {
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'admin' || role === 'super_admin'
}

export async function isSuperAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'super_admin'
}
