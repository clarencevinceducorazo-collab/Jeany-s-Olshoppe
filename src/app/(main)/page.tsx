import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const featuredProducts = getProducts({ featured: true, limit: 4 });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 pt-8 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-secondary/40 to-background border border-border/50 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-full md:w-1/2 z-10">
              <span className="text-xs font-medium tracking-widest text-accent uppercase mb-3 block">New Arrivals</span>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary mb-4 leading-tight">Curated style for the everyday.</h1>
              <p className="text-sm md:text-base text-foreground/70 mb-8 max-w-md leading-relaxed">Discover our latest collection of unique Japan surplus items. Handpicked for quality and aesthetic.</p>
              <Button asChild className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 w-max h-auto">
                <Link href="/shop">
                  Shop Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
          </div>
          
          <div className="w-full md:w-1/2 aspect-video md:aspect-square max-h-[24rem] rounded-xl bg-secondary/50 relative overflow-hidden group">
              <Image
                src="https://picsum.photos/seed/hero-home/800/800"
                alt="Minimalist essentials"
                fill
                className="object-cover"
                data-ai-hint="minimalist fashion aesthetic"
                priority
              />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 pb-12 md:pb-20">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-primary">Trending Now</h2>
            <Button asChild variant="link" className="text-sm font-medium text-accent hover:underline underline-offset-4">
              <Link href="/shop">View all</Link>
            </Button>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}
