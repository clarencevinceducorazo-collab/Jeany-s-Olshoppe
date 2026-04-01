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
      <section className="relative h-[60vh] w-full bg-primary/10">
        <Image
          src="https://picsum.photos/seed/hero/1200/800"
          alt="Vintage clothing rack"
          fill
          className="object-cover"
          data-ai-hint="vintage clothing"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl font-headline drop-shadow-md">
            Curated Finds, Unbeatable Prices
          </h1>
          <p className="mt-4 max-w-xl text-lg md:text-xl drop-shadow">
            Discover unique Japan surplus items, from vintage fashion to rare electronics.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px]">
            <Link href="/shop">Shop New Arrivals</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold text-center font-headline">
              Featured Products
            </h2>
            <Sparkles className="h-6 w-6 text-accent" />
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
