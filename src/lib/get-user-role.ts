import { createClient } from '@/lib/supabase/server'

export type UserRole = 'user' | 'admin' | 'super_admin' | null

export async function getUserRole(): Promise<UserRole> {
  try {
    const supabase = await createClient()

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

    const roleString = typeof profile?.role === 'string' ? profile.role.toLowerCase() : 'user';
    return (roleString as UserRole) ?? 'user';
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
