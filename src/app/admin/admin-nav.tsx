'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Home, Contact, Users,
  Bike, Map, MessageSquare, ArrowLeft, LogOut,
  MoreHorizontal, ShieldCheck, X, ChevronRight
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  superAdminOnly?: boolean
}

const ALL_NAV: NavItem[] = [
  { href: '/admin',          label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products',       icon: Package },
  { href: '/admin/homepage', label: 'Home Manager',   icon: Home },
  { href: '/admin/team',     label: 'Staff Team',     icon: Contact },
  { href: '/admin/users',    label: 'Users',          icon: Users,         superAdminOnly: true },
  { href: '/admin/riders',   label: 'Riders',         icon: Bike,          superAdminOnly: true },
  { href: '/admin/map',      label: 'Maps',           icon: Map,           superAdminOnly: true },
  { href: '/admin/chat',     label: 'Dispatch Chat',  icon: MessageSquare, superAdminOnly: true },
]

interface AdminNavProps {
  role: string
  onLogout: () => void
}

export function AdminNav({ role, onLogout }: AdminNavProps) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  // Close more drawer on route change
  useEffect(() => { setMoreOpen(false) }, [pathname])

  const isSuperAdmin = role === 'super_admin'
  const visibleItems = ALL_NAV.filter(i => !i.superAdminOnly || isSuperAdmin)

  // Mobile bottom nav: first 3 + "More"
  const bottomPrimary = visibleItems.slice(0, 3)
  // "More" drawer items = everything else
  const moreItems = visibleItems.slice(3)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <>
      {/* ══ DESKTOP SIDEBAR (≥1024px) ══════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#1a1512] border-r border-white/5 shrink-0 fixed left-0 top-0 bottom-0 z-40">
        {/* Brand */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm tracking-wide leading-tight">Admin Panel</p>
              <p className="text-white/40 text-xs capitalize">{role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {visibleItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive(href)
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive(href) ? 'text-accent' : 'text-white/40 group-hover:text-accent'} transition-colors`} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom links */}
        <div className="p-3 border-t border-white/5 space-y-0.5">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ══ TABLET SIDEBAR (768–1023px) ════════════════════════════════════ */}
      <aside className="hidden md:flex lg:hidden flex-col w-16 min-h-screen bg-[#1a1512] border-r border-white/5 shrink-0 fixed left-0 top-0 bottom-0 z-40 items-center py-4 gap-1">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-3 shrink-0">
          <ShieldCheck className="w-5 h-5 text-accent" />
        </div>

        {visibleItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isActive(href)
                ? 'bg-accent/15 text-accent'
                : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
          </Link>
        ))}

        <div className="mt-auto space-y-1">
          <Link href="/" title="Back to Store" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <button onClick={onLogout} title="Sign Out" className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ══ MOBILE TOP HEADER (<768px) ════════════════════════════════════ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#1a1512]/95 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none tracking-wide">Admin</p>
            <p className="text-white/40 text-[10px] capitalize leading-tight">{role.replace('_', ' ')}</p>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
          <ArrowLeft className="w-3.5 h-3.5" /> Store
        </Link>
      </header>

      {/* ══ MOBILE BOTTOM NAV BAR (<768px) ════════════════════════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1512]/97 backdrop-blur-xl border-t border-white/8 safe-area-pb">
        <div className="flex items-stretch h-16">
          {bottomPrimary.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                isActive(href) ? 'text-accent' : 'text-white/40 hover:text-white'
              }`}
            >
              <div className={`relative w-10 h-6 flex items-center justify-center rounded-full transition-all ${isActive(href) ? 'bg-accent/15' : ''}`}>
                <Icon className="w-5 h-5" />
                {isActive(href) && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />}
              </div>
              <span className="text-[10px] font-medium leading-none">{label.split(' ')[0]}</span>
            </Link>
          ))}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
              moreOpen ? 'text-accent' : 'text-white/40 hover:text-white'
            }`}
          >
            <div className={`w-10 h-6 flex items-center justify-center rounded-full transition-all ${moreOpen ? 'bg-accent/15' : ''}`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* ══ MOBILE "MORE" BOTTOM DRAWER ═══════════════════════════════════ */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setMoreOpen(false)}>
          {/* Scrim */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer panel */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#1e1a16] border-t border-white/10 rounded-t-3xl pb-safe"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-white/5">
              <p className="text-white font-semibold text-sm">More Options</p>
              <button onClick={() => setMoreOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* More nav items */}
            <div className="p-3 space-y-1 max-h-[55vh] overflow-y-auto">
              {moreItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] ${
                    isActive(href)
                      ? 'bg-accent/15 text-accent border border-accent/20'
                      : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive(href) ? 'bg-accent/20' : 'bg-white/5'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-white/20" />
                </Link>
              ))}

              <div className="h-px bg-white/5 my-2" />

              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 border border-transparent transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Back to Store</span>
                <ChevronRight className="w-4 h-4 ml-auto text-white/20" />
              </Link>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400/80 hover:text-red-400 hover:bg-red-400/5 border border-transparent transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>

            {/* Bottom safe area spacer */}
            <div className="h-6" />
          </div>
        </div>
      )}
    </>
  )
}
