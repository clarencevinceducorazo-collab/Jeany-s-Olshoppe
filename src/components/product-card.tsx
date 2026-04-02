import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isNew = Date.now() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
  const isSoldOut = product.stock_qty === 0;

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <Card className="overflow-hidden bg-background/50 border-transparent shadow-none transition-all duration-500 ease-in-out hover:bg-muted/30">
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              data-ai-hint={product.imageHint}
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isNew && !isSoldOut && (
                <Badge variant="default" className="bg-background text-foreground hover:bg-background/90 px-3 py-1 font-medium tracking-wide shadow-sm backdrop-blur-md">
                  NEW
                </Badge>
              )}
              {isSoldOut && (
                <Badge variant="secondary" className="bg-background/80 text-foreground/60 px-3 py-1 font-medium tracking-wide shadow-sm backdrop-blur-md">
                  SOLD
                </Badge>
              )}
            </div>
          </div>
          <div className="p-4 pt-5 text-center">
            <h3 className="truncate font-semibold text-foreground tracking-tight">{product.name}</h3>
            <p className="mt-1 text-muted-foreground font-medium">${product.price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
