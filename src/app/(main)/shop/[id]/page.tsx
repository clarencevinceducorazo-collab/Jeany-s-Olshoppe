import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Share2, Info } from 'lucide-react';
import { ProductActions } from './product-actions';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  const isNew = Date.now() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
  const isSoldOut = product.stock_qty === 0;

  const messageText = `Hi! I'm interested in this product:

Name: ${product.name}
Description: ${product.description}
Price: ₱${product.price.toFixed(2)}

Is this still available?`;

  const encodedMessage = encodeURIComponent(messageText);
  const messengerLink = `https://m.me/100064110249756?ref=WebsiteVisitor&text=${encodedMessage}`;

  return (
    <div className="container mx-auto max-w-4xl px-0 sm:px-4 py-0 sm:py-8">
      <div className="grid md:grid-cols-2 md:gap-12">
        
        {/* Image Carousel */}
        <div className="md:sticky top-20 self-start">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative bg-muted sm:rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.name} - image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
             {product.images.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col gap-6 p-4 sm:p-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{product.name}</h1>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                </Button>
            </div>
            <div className="flex items-center gap-3">
                <p className="text-3xl font-semibold text-accent">₱{product.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
                  {isNew && !isSoldOut && <Badge className="bg-accent text-accent-foreground">NEW</Badge>}
                </div>
            </div>
          </div>
          
          <div className="text-sm">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Info className="h-4 w-4"/> Details</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                <span className="font-medium">Category:</span><span>{product.category}</span>
                <span className="font-medium">Condition:</span><span>{product.condition}</span>
                <span className="font-medium">Stock:</span><span>{isSoldOut ? '0' : product.stock_qty}</span>
                <span className="font-medium">Posted:</span><span>{new Date(product.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap text-sm">{product.description}</p>
          </div>
          
          <Separator className="my-2" />

          {/* Action Buttons */}
          <ProductActions 
            isSoldOut={isSoldOut}
            messengerLink={messengerLink}
            messageText={messageText}
          />
        </div>
      </div>
    </div>
  );
}
