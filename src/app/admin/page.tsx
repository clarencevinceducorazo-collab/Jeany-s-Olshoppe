import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/get-user-role'
import { Package, Users, Star, Archive } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const role = await getUserRole()

  const [{ count: totalProducts }, { count: totalUsers }, { count: featuredCount }, { count: archivedCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('people').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_archived', true),
  ])

  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, name, price, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total Products', value: totalProducts ?? 0, icon: Package, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Total Users', value: totalUsers ?? 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Featured', value: featuredCount ?? 0, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Archived', value: archivedCount ?? 0, icon: Archive, color: 'text-white/40', bg: 'bg-white/5' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white/5 border border-white/5 rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Products</h2>
            <Link href="/admin/products/new" className="text-accent text-xs hover:underline">+ Add New</Link>
          </div>
          <div className="space-y-3">
            {recentProducts?.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/70 text-sm truncate pr-4">{p.name}</span>
                <span className="text-accent text-sm font-medium whitespace-nowrap">₱{Number(p.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
            {!recentProducts?.length && <p className="text-white/30 text-sm">No products yet.</p>}
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/products/new" className="flex items-center gap-3 w-full p-3 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-lg transition-all group">
              <Package className="w-4 h-4 text-accent" />
              <span className="text-sm text-white/80 group-hover:text-white">Create New Product</span>
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 w-full p-3 bg-white/5 hover:bg-white/8 border border-white/5 rounded-lg transition-all group">
              <Package className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/60 group-hover:text-white">Manage Products</span>
            </Link>
            {role === 'super_admin' && (
              <Link href="/admin/users" className="flex items-center gap-3 w-full p-3 bg-white/5 hover:bg-white/8 border border-white/5 rounded-lg transition-all group">
                <Users className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/60 group-hover:text-white">Manage Users</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
