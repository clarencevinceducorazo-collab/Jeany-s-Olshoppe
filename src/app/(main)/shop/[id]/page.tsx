import { getProductById } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

// This is a placeholder for the WhatsApp icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.06 21.94L7.31 20.55C8.76 21.33 10.37 21.8 12.04 21.8C17.5 21.8 21.95 17.35 21.95 11.9C21.95 6.45 17.5 2 12.04 2M12.04 3.67C16.56 3.67 20.28 7.39 20.28 11.9C20.28 16.41 16.56 20.13 12.04 20.13C10.53 20.13 9.09 19.72 7.88 19L7.54 18.82L4.44 19.65L5.28 16.64L5.07 16.29C4.17 14.91 3.79 13.34 3.79 11.9C3.79 7.39 7.51 3.67 12.04 3.67M17.18 14.45C16.92 15.28 15.63 15.91 15.06 16.09C14.49 16.27 13.68 16.27 13.06 16.09C12.43 15.91 11.13 15.28 9.88 14.03C8.39 12.54 7.42 10.84 7.24 10.58C7.06 10.32 6.13 9.08 6.13 7.9C6.13 6.72 6.94 5.91 7.18 5.65C7.42 5.39 7.76 5.3 7.99 5.3C8.22 5.3 8.45 5.3 8.63 5.3C8.87 5.3 9.1 5.39 9.34 5.86C9.58 6.33 10.01 7.42 10.1 7.59C10.18 7.77 10.27 7.95 10.18 8.13C10.1 8.31 10.01 8.4 9.88 8.57C9.75 8.75 9.63 8.89 9.5 9.02C9.37 9.15 9.25 9.29 9.37 9.5C9.49 9.71 9.97 10.58 10.74 11.35C11.75 12.36 12.53 12.7 12.87 12.87C13.22 13.05 13.36 13.01 13.54 12.83C13.72 12.65 14.07 12.18 14.31 11.9C14.55 11.62 14.79 11.58 15.02 11.67C15.26 11.76 16.3 12.27 16.54 12.36C16.78 12.45 16.96 12.54 17.05 12.63C17.14 12.72 17.14 13.08 17.05 13.26C16.96 13.44 16.92 13.62 16.83 13.71C16.74 13.8 17.27 13.62 17.18 14.45Z" />
  </svg>
);

type ProductPageProps = {
  params: { id: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const isNew = Date.now() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
  const isSoldOut = product.stock_qty === 0;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="md:sticky top-20 self-start">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.name} - image ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint={product.imageHint}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
             {product.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold font-headline tracking-tight">{product.name}</h1>
                <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                </Button>
            </div>
            <div className="mt-2 flex items-center gap-2">
                <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
                {isNew && !isSoldOut && <Badge className="bg-accent text-accent-foreground">NEW</Badge>}
            </div>
          </div>
          
          <Card>
            <CardHeader>
                <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium text-muted-foreground">Category</p>
                    <p>{product.category}</p>
                </div>
                <div>
                    <p className="font-medium text-muted-foreground">Condition</p>
                    <p>{product.condition}</p>
                </div>
                <div>
                    <p className="font-medium text-muted-foreground">Stock</p>
                    <p>{isSoldOut ? '0' : product.stock_qty} available</p>
                </div>
                <div>
                    <p className="font-medium text-muted-foreground">Posted</p>
                    <p>{new Date(product.created_at).toLocaleDateString()}</p>
                </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          </div>
          
          <Separator />

          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full min-h-[44px]" disabled={isSoldOut}>
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
            <p className="text-center text-sm text-muted-foreground">or contact seller via</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild size="lg" variant="outline" className="w-full min-h-[44px]">
                <a href="https://m.me/your-messenger-username" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" /> Messenger
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full min-h-[44px]">
                 <a href="https://wa.me/your-whatsapp-number" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                  <WhatsAppIcon /> <span className="ml-2">WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
