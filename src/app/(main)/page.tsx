import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/animations/fade-in";
import { ContactSection } from "@/components/contact-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  alternates: {
    canonical: "https://jeanys-olshoppe.vercel.app",
  },
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_archived', false)
    .limit(8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        aria-label="Hero – Japan Surplus Philippines"
        className="relative w-full pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-border/40"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

            <div className="w-full md:w-5/12 z-10 flex flex-col items-start pt-6">
              <FadeIn delay={0.1}>
                <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase mb-6 block">
                  Premium Japan Surplus – Philippines
                </span>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-5xl md:text-7xl font-headline font-semibold tracking-tight text-primary mb-6 leading-[1.05]">
                  Wabi-Sabi Aesthetics.
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-base md:text-lg text-foreground/70 mb-10 max-w-sm leading-relaxed font-medium">
                  Discover authentic Japan surplus items at Jeany&apos;s Olshoppe. Handpicked for quality, minimalism, and quiet elegance — delivered anywhere in the Philippines.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <Button
                  asChild
                  className="group bg-primary text-primary-foreground h-12 px-8 rounded-sm text-sm font-semibold tracking-wider uppercase hover:bg-foreground transition-all shadow-none flex items-center gap-3"
                >
                  <Link href="/shop">
                    Explore Collection
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </FadeIn>
            </div>

            <div className="w-full md:w-7/12 relative mt-8 md:mt-0">
              <FadeIn delay={0.3} direction="left">
                <div className="aspect-[4/5] md:aspect-[3/2] w-full relative overflow-hidden bg-secondary/20">
                  <Image
                    src="https://picsum.photos/seed/japandi-hero/1200/800"
                    alt="Japan surplus items collection at Jeany's Olshoppe – affordable quality finds in the Philippines"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                </div>
              </FadeIn>
              {/* Decorative Element */}
              <FadeIn
                delay={0.6}
                direction="up"
                className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/80 backdrop-blur-md hidden md:flex items-center justify-center p-8"
              >
                <p className="text-xs font-serif italic text-foreground tracking-widest leading-loose text-center">
                  &ldquo;Simplicity is the ultimate sophistication.&rdquo;
                </p>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        aria-labelledby="featured-heading"
        className="py-20 md:py-32 bg-background"
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-border/40 pb-6">
              <div>
                <h2
                  id="featured-heading"
                  className="text-3xl font-headline font-semibold tracking-tight text-primary mb-2"
                >
                  Selected Arrivals
                </h2>
                <p className="text-muted-foreground font-medium text-sm">
                  Pieces that bring calm to your space.
                </p>
              </div>
              <Button
                asChild
                variant="link"
                className="text-sm font-semibold uppercase tracking-widest text-accent hover:text-primary transition-colors p-0 h-auto"
              >
                <Link href="/shop">View All Items</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <ProductGrid products={featuredProducts || []} />
          </FadeIn>
        </div>
      </section>

      {/* Contact & Action Section */}
      <ContactSection />
    </div>
  );
}
