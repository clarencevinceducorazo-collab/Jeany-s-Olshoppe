import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/get-user-role'
import { LayoutDashboard, Package, Users, LogOut, ArrowLeft, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

async function AdminSidebar({ role }: { role: string }) {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    ...(role === 'super_admin' ? [{ href: '/admin/users', label: 'Users', icon: Users }] : []),
  ]

  async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-[#1a1512] border-r border-white/5 flex flex-col shrink-0">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm tracking-wide">Admin Panel</p>
            <p className="text-white/40 text-xs capitalize">{role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm group"
          >
            <Icon className="w-4 h-4 group-hover:text-accent transition-colors" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
        <form action={logout}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole()
  if (!role || (role !== 'admin' && role !== 'super_admin')) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-[#120f0c]">
      <AdminSidebar role={role} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
