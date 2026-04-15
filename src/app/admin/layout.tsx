import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/get-user-role'
import { AdminNav } from './admin-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole()
  if (!role || (role !== 'admin' && role !== 'super_admin')) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#120f0c]">
      {/* AdminNav handles all 3 breakpoints and imports its own server actions */}
      <AdminNav role={role} />

      {/* Content area — offsets per breakpoint */}
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
