'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Radio, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { UserRole } from '@/lib/get-user-role';

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const isAdmin = role === 'admin' || role === 'super_admin';

  // Keep it lean — max 4 primary tabs + Admin if needed
  const coreItems = [
    { href: '/',      icon: Home,        label: 'Home' },
    { href: '/shop',  icon: ShoppingBag, label: 'Shop' },
    { href: '/live',  icon: Radio,       label: 'Live', isLive: true },
    { href: '/me',    icon: User,        label: 'Me' },
  ];

  const navItems = [
    ...coreItems,
    ...(isAdmin ? [{ href: '/admin', icon: ShieldCheck, label: 'Admin', isLive: false }] : []),
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Bottom navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Pill container — floats above bottom edge */}
      <div className="mx-3 mb-3">
        <div
          className={cn(
            'flex h-16 items-stretch justify-around',
            'rounded-2xl bg-background/90 backdrop-blur-2xl',
            'border border-border/60 shadow-xl shadow-black/10',
          )}
        >
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-1 flex-col items-center justify-center gap-0.5 select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className={cn(
                      'absolute inset-x-1.5 inset-y-1.5 rounded-xl -z-0',
                      item.isLive ? 'bg-red-500/10' : 'bg-accent/10'
                    )}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}

                {/* Live pulse ring */}
                {item.isLive && (
                  <span className="absolute top-2.5 right-[calc(50%-8px)] flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}

                <item.icon
                  className={cn(
                    'relative z-10 h-[22px] w-[22px] transition-all duration-200',
                    isActive
                      ? item.isLive
                        ? 'text-red-500 stroke-[2.2]'
                        : 'text-accent stroke-[2.2]'
                      : 'text-foreground/40 stroke-[1.5]'
                  )}
                />
                <span
                  className={cn(
                    'relative z-10 text-[10px] font-semibold tracking-wide leading-none transition-all duration-200',
                    isActive
                      ? item.isLive ? 'text-red-500' : 'text-accent'
                      : 'text-foreground/40'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
