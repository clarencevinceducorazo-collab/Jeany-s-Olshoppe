'use client';

import Link from 'next/link';
import { Heart, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
  ];

  return (
    <header className="sticky top-0 z-40 hidden w-full border-b bg-background/80 backdrop-blur-md md:block">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-semibold tracking-tighter text-accent">
            JEANYS
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-medium transition-colors',
                  pathname === link.href ? 'text-accent' : 'text-foreground/50 hover:text-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/shop">
              <Search className="h-5 w-5 text-foreground/80 transition-colors hover:text-accent" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/saved">
              <Heart className="h-5 w-5 text-foreground/80 transition-colors hover:text-accent" />
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>
           <Button variant="ghost" size="icon" asChild>
            <Link href="/me">
              <User className="h-5 w-5 text-foreground/80 transition-colors hover:text-accent" />
              <span className="sr-only">My Account</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
