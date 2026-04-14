import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/get-user-role'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from './admin-nav'

async function logoutAction() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole()
  if (!role || (role !== 'admin' && role !== 'super_admin')) {
    redirect('/')
  }

  // Client wrapper needs a serialisable logout – pass a bound server action
  // We expose a form-based logout for the client component
  return (
    <div className="min-h-screen bg-[#120f0c]">
      <AdminNav role={role} onLogout={logoutAction} />

      {/* Content offset: desktop=left-64, tablet=left-16, mobile=top-14+bottom-16 */}
      <main className="
        lg:pl-64 md:pl-16
        pt-14 md:pt-0
        pb-20 md:pb-0
        min-h-screen overflow-x-hidden
      ">
        {children}
      </main>
    </div>
  )
}
