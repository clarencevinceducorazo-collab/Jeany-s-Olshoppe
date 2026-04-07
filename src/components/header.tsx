'use client';

import Link from 'next/link';
import { Heart, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Header() {
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-xl font-headline font-semibold tracking-[0.2em] text-primary uppercase">
            Jeanys
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group relative font-medium tracking-wide uppercase text-xs transition-colors',
                    isActive ? 'text-primary' : 'text-foreground/50 hover:text-primary'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="header-underline"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent"
                    />
                  )}
                  {!isActive && (
                    <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hover:bg-secondary rounded-full">
            <Link href="/shop">
              <Search className="h-[18px] w-[18px] text-foreground/80 transition-colors" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="hover:bg-secondary rounded-full">
              <Link href="/saved">
                <Heart className="h-[18px] w-[18px] text-foreground/80 transition-colors" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:bg-secondary rounded-full">
              <Link href="/me">
                <User className="h-[18px] w-[18px] text-foreground/80 transition-colors" />
                <span className="sr-only">My Account</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
