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
      <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              data-ai-hint={product.imageHint}
            />
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {isNew && !isSoldOut && (
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  NEW
                </Badge>
              )}
              {isSoldOut && (
                <Badge variant="secondary" className="bg-card/80">
                  Sold Out
                </Badge>
              )}
            </div>
          </div>
          <div className="p-4">
            <h3 className="truncate font-semibold text-foreground">{product.name}</h3>
            <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
