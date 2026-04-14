import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/get-user-role'
import { Package, Users, Star, Archive, Plus, ShoppingBag, Home, Contact } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const role = await getUserRole()
  const isSuperAdmin = role === 'super_admin'

  const [
    { count: totalProducts },
    { count: totalUsers },
    { count: featuredCount },
    { count: archivedCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('people').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_archived', true),
  ])

  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, name, price, images, created_at, badge, is_archived')
    .order('created_at', { ascending: false })
    .limit(6)

  const stats = [
    { label: 'Products',  value: totalProducts ?? 0,  icon: Package,  color: 'text-accent',        bg: 'bg-accent/10',        href: '/admin/products' },
    { label: 'Users',     value: totalUsers ?? 0,     icon: Users,    color: 'text-blue-400',       bg: 'bg-blue-400/10',      href: '/admin/users' },
    { label: 'Featured',  value: featuredCount ?? 0,  icon: Star,     color: 'text-yellow-400',     bg: 'bg-yellow-400/10',    href: '/admin/products' },
    { label: 'Archived',  value: archivedCount ?? 0,  icon: Archive,  color: 'text-white/50',       bg: 'bg-white/5',          href: '/admin/products' },
  ]

  const quickActions = [
    { label: 'Add Product',    href: '/admin/products/new', icon: Plus,        color: 'from-accent/20 to-accent/5 border-accent/20 hover:border-accent/40', iconColor: 'text-accent' },
    { label: 'All Products',   href: '/admin/products',     icon: Package,     color: 'from-white/5 to-white/2 border-white/5 hover:border-white/15',       iconColor: 'text-white/60' },
    { label: 'Home Manager',   href: '/admin/homepage',     icon: Home,        color: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40', iconColor: 'text-purple-400' },
    { label: 'Staff Team',     href: '/admin/team',         icon: Contact,     color: 'from-white/5 to-white/2 border-white/5 hover:border-white/15',       iconColor: 'text-white/60' },
    ...(isSuperAdmin ? [
      { label: 'Manage Users', href: '/admin/users',        icon: Users,       color: 'from-white/5 to-white/2 border-white/5 hover:border-white/15',       iconColor: 'text-white/60' },
    ] : []),
  ]

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-white/40 text-xs md:text-sm mt-1">Welcome back! Here's a quick overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white/5 border border-white/5 rounded-2xl p-4 md:p-5 hover:border-white/10 hover:bg-white/8 transition-all active:scale-[0.98] group"
          >
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
            <p className="text-white/40 text-xs mt-1 font-medium">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent rounded-full inline-block" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map(({ label, href, icon: Icon, color, iconColor }) => (
              <Link
                key={href + label}
                href={href}
                className={`flex flex-col items-start gap-3 p-4 rounded-2xl border bg-gradient-to-br ${color} transition-all active:scale-[0.97] group`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <span className="text-xs font-semibold text-white/80 group-hover:text-white leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-400 rounded-full inline-block" />
              Recent Products
            </h2>
            <Link href="/admin/products/new" className="text-accent text-xs font-semibold hover:text-accent/80 transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add New
            </Link>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {recentProducts?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-white/30">
                <ShoppingBag className="w-8 h-8 mb-3 opacity-30" />
                <p className="text-sm">No products yet</p>
              </div>
            )}
            {recentProducts?.map((p, i) => (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                target="_blank"
                className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group ${i < recentProducts.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-xl bg-white/10 relative overflow-hidden shrink-0 border border-white/5">
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-4 h-4 m-auto text-white/20 absolute inset-0 m-auto" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors">{p.name}</p>
                  {p.badge && (
                    <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">{p.badge}</span>
                  )}
                </div>
                <span className="text-accent text-sm font-bold font-mono whitespace-nowrap shrink-0">
                  ₱{Number(p.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <Link
        href="/admin/products/new"
        className="lg:hidden fixed bottom-20 right-4 z-30 flex items-center justify-center w-14 h-14 bg-accent rounded-full shadow-2xl shadow-accent/40 hover:bg-accent/90 active:scale-95 transition-all"
        aria-label="Add Product"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  )
}
