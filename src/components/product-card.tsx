import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isNew = Date.now() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
  const isSoldOut = product.stock_qty === 0;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-xl border border-transparent transition-colors group-hover:border-border">
        <Link href={`/shop/${product.id}`} className="block">
          <div className={cn(
            "aspect-[3/4] w-full bg-muted/40",
            isSoldOut && "opacity-60"
          )}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              data-ai-hint={product.imageHint}
            />
          </div>
        </Link>
        <div className="absolute top-3 left-3">
          {isSoldOut ? (
            <Badge variant="secondary" className="bg-background/80 text-foreground/60 backdrop-blur-md">SOLD</Badge>
          ) : isNew && (
            <Badge className="bg-accent text-accent-foreground">NEW</Badge>
          )}
        </div>
        {!isSoldOut && (
          <Button size="icon" className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm transform group-hover:translate-y-0 translate-y-2 bg-white text-primary hover:bg-white hover:text-accent">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        )}
      </div>

      <div className="mt-3 flex justify-between items-start gap-2">
        <div>
          <h3 className="text-sm font-medium text-primary leading-tight">
             <Link href={`/shop/${product.id}`} className="hover:text-accent transition-colors">{product.name}</Link>
          </h3>
        </div>
        <p className="text-sm font-medium text-accent shrink-0">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
