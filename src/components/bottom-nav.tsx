'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/shop', icon: ShoppingBag, label: 'Shop' },
  { href: '/saved', icon: Heart, label: 'Saved' },
  { href: '/me', icon: User, label: 'Me' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/90 backdrop-blur-lg md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-accent' : 'text-foreground/50 hover:text-accent'
              )}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <item.icon className="h-[22px] w-[22px]" strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
