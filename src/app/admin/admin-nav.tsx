'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Home, Contact, Users,
  Bike, Map, MessageSquare, ArrowLeft, LogOut,
  MoreHorizontal, ShieldCheck, X, ChevronRight, Loader2
} from 'lucide-react'
import { logoutAction } from './logout-action'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  superAdminOnly?: boolean
}

const ALL_NAV: NavItem[] = [
  { href: '/admin',          label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products',      icon: Package },
  { href: '/admin/homepage', label: 'Home Manager',  icon: Home },
  { href: '/admin/team',     label: 'Staff Team',    icon: Contact },
  { href: '/admin/users',    label: 'Users',         icon: Users,         superAdminOnly: true },
  { href: '/admin/riders',   label: 'Riders',        icon: Bike,          superAdminOnly: true },
  { href: '/admin/map',      label: 'Maps',          icon: Map,           superAdminOnly: true },
  { href: '/admin/chat',     label: 'Dispatch Chat', icon: MessageSquare, superAdminOnly: true },
]

interface AdminNavProps {
  role: string
}

export function AdminNav({ role }: AdminNavProps) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const [logoutPending, startLogout] = useTransition()

  // Close drawer on route change
  useEffect(() => { setMoreOpen(false) }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [moreOpen])

  const isSuperAdmin = role === 'super_admin'
  const visibleItems = ALL_NAV.filter(i => !i.superAdminOnly || isSuperAdmin)

  // Bottom nav: first 3 primary + More
  const bottomPrimary = visibleItems.slice(0, 3)
  const moreItems = visibleItems.slice(3)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const handleLogout = () => {
    startLogout(async () => {
      await logoutAction()
    })
  }

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
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive(href) ? 'text-accent' : 'text-white/40 group-hover:text-accent'}`} />
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
            onClick={handleLogout}
            disabled={logoutPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all disabled:opacity-50"
          >
            {logoutPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══ TABLET SIDEBAR (768–1023px) ════════════════════════════════════ */}
      <aside className="hidden md:flex lg:hidden flex-col w-16 min-h-screen bg-[#1a1512] border-r border-white/5 shrink-0 fixed left-0 top-0 bottom-0 z-40 items-center py-4 gap-1">
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
          <button
            onClick={handleLogout}
            title="Sign Out"
            disabled={logoutPending}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            {logoutPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
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
        <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
          <ArrowLeft className="w-3.5 h-3.5" /> Store
        </Link>
      </header>

      {/* ══ MOBILE BOTTOM NAVIGATION BAR ══════════════════════════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1512] border-t border-white/10" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch h-16">
          {bottomPrimary.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 select-none ${
                isActive(href) ? 'text-accent' : 'text-white/40'
              }`}
            >
              <div className={`relative flex items-center justify-center rounded-xl w-11 h-6 transition-all ${isActive(href) ? 'bg-accent/15' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium leading-none">{label.split(' ')[0]}</span>
            </Link>
          ))}

          {/* More tab */}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 select-none ${
              moreOpen ? 'text-accent' : 'text-white/40'
            }`}
          >
            <div className={`flex items-center justify-center rounded-xl w-11 h-6 transition-all ${moreOpen ? 'bg-accent/15' : ''}`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* ══ MOBILE "MORE" BOTTOM DRAWER ════════════════════════════════════ */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Dark scrim */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />

          {/* Drawer */}
          <div className="relative bg-[#1e1a16] border-t border-white/10 rounded-t-3xl max-h-[80vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <p className="text-white font-semibold text-sm">More Options</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 active:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="p-3 space-y-1 overflow-y-auto">
              {moreItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] ${
                    isActive(href)
                      ? 'bg-accent/15 text-accent border border-accent/20'
                      : 'text-white/70 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive(href) ? 'bg-accent/20' : 'bg-white/5'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm flex-1">{label}</span>
                  <ChevronRight className="w-4 h-4 text-white/20" />
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
                <span className="font-medium text-sm flex-1">Back to Store</span>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutPending}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400/80 hover:text-red-400 hover:bg-red-400/5 border border-transparent transition-all disabled:opacity-50"
              >
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                  {logoutPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                </div>
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>

            <div className="h-4" />
          </div>
        </div>
      )}
    </>
  )
}
