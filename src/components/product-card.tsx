import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isNew = Date.now() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
  const isSoldOut = product.stock_qty === 0;

  return (
    <div className="group flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-sm bg-secondary/30 aspect-[3/4]">
        <Link href={`/shop/${product.id}`} className="block h-full w-full">
          <div className={cn(
            "h-full w-full",
            isSoldOut && "opacity-50 grayscale"
          )}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              data-ai-hint={product.imageHint}
            />
          </div>
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isSoldOut ? (
            <span className="bg-background/80 text-foreground/80 backdrop-blur-md text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">Sold Out</span>
          ) : isNew && (
            <span className="bg-foreground text-background text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm shadow-sm">New</span>
          )}
        </div>
        {!isSoldOut && (
          <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 bg-background/50 hover:bg-background text-foreground backdrop-blur-sm">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        )}
      </div>

      <div className="flex justify-between items-start gap-4">
        <Link href={`/shop/${product.id}`} className="group-hover:text-accent transition-colors">
          <h3 className="text-sm font-medium tracking-tight text-foreground line-clamp-2">
             {product.name}
          </h3>
        </Link>
        <p className="text-sm font-medium tracking-tight text-foreground/80 shrink-0">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
