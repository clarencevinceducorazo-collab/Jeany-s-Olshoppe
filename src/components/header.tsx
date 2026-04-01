'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
  ];

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b bg-background/80 backdrop-blur-sm md:block">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            Jeanys Olshoppe
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground font-semibold' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Input type="search" placeholder="Search products..." className="pr-10" />
            <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/saved">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/me">
              <User className="h-5 w-5" />
              <span className="sr-only">My Account</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
