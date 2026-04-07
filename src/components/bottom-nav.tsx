'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { UserRole } from '@/lib/get-user-role';

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/shop', icon: ShoppingBag, label: 'Shop' },
    { href: '/saved', icon: Heart, label: 'Saved' },
    { href: '/me', icon: User, label: 'Me' },
    ...(role === 'admin' || role === 'super_admin' ? [{ href: '/admin', icon: ShieldCheck, label: 'Admin' }] : []),
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-sm md:hidden">
      <div className="flex h-16 items-center justify-around px-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex h-full w-full flex-col items-center justify-center gap-1 z-10"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-2 bg-secondary/50 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon 
                className={cn(
                  "h-[22px] w-[22px] transition-all duration-300", 
                  isActive ? "text-accent stroke-[2]" : "text-foreground/50 stroke-[1.5]"
                )} 
              />
              <span className={cn(
                "text-[10px] font-semibold transition-all duration-300",
                isActive ? "text-foreground opacity-100" : "text-foreground/50 opacity-0 -translate-y-2 pointer-events-none absolute"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
