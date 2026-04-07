import { createClient } from '@/lib/supabase/server'

export type UserRole = 'user' | 'admin' | 'super_admin' | null

export async function getUserRole(): Promise<UserRole> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user || authError) {
      console.log("getUserRole: No user or auth error", authError);
      return null
    }

    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      
    if (dbError) {
       console.log("getUserRole: DB Error fetching profile:", dbError);
       return 'user';
    }

    console.log("getUserRole: Found role:", profile?.role);
    return (profile?.role as UserRole) ?? 'user'
  } catch (err) {
    console.log("getUserRole: Try/Catch Error:", err);
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
