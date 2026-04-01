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
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
