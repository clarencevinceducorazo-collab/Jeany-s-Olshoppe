import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/placeholder-images";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const featuredProducts = getProducts({ featured: true, limit: 4 });

  return (
    <div className="flex flex-col">
      <section className="relative w-full bg-secondary overflow-hidden py-20 px-4 md:py-32">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-background border text-xs font-medium uppercase tracking-widest text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Premium Surplus</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl font-headline text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              Curated Finds,<br/>Unbeatable Prices
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground md:text-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
              Discover unique Japan surplus items, from vintage fashion to rare electronics. Handpicked for quality and aesthetic.
            </p>
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
              <Button asChild size="lg" className="h-14 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <Link href="/shop">Shop New Arrivals</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-[400px] w-full md:h-[600px] animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="absolute inset-0 bg-background/50 rounded-[2rem] -rotate-3 scale-105 transition-transform duration-500 hover:rotate-0" />
            <Image
              src="https://picsum.photos/seed/vintage-aesthetic/800/1000"
              alt="Vintage aesthetic"
              fill
              className="object-cover rounded-[2rem] shadow-xl"
              data-ai-hint="vintage clothing neutral aesthetic"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-3 mb-12">
            <h2 className="text-4xl font-bold text-center font-headline text-foreground">
              Featured Pieces
            </h2>
            <div className="h-1 w-20 bg-accent rounded-full" />
          </div>
          <ProductGrid products={featuredProducts} />
           <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="min-h-[44px]">
                <Link href="/shop">View All Products</Link>
            </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
