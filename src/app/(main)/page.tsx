import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/animations/fade-in";
import { DynamicContactSection } from "@/components/dynamic-contact-section";
import { DynamicHomeSections } from "@/components/dynamic-home-sections";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Home",
  alternates: {
    canonical: "https://jeanys-olshoppe.vercel.app",
  },
};

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch products and home content in parallel
  const [
    { data: featuredProducts },
    { data: contentRows },
    { data: dynamicSections },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_archived', false)
      .limit(8),
    supabase
      .from('home_content')
      .select('id, data'),
    supabase
      .from('home_sections')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true }),
  ])

  // Build content map — fallback to hardcoded defaults if table doesn't exist yet
  const contentMap: Record<string, Record<string, unknown>> = {}
  for (const row of contentRows || []) {
    contentMap[row.id] = row.data
  }

  const hero = contentMap['hero'] || {}
  const featured = contentMap['featured'] || {}
  const contact = contentMap['contact'] || {}

  // Hero values with fallbacks
  const heroTitle = (hero.title as string) || 'Wabi-Sabi Aesthetics.'
  const heroSubtitle = (hero.subtitle as string) || 'Premium Japan Surplus – Philippines'
  const heroDescription = (hero.description as string) || "Discover authentic Japan surplus items at Jeany's Olshoppe. Handpicked for quality, minimalism, and quiet elegance — delivered anywhere in the Philippines."
  const heroBtnText = (hero.button_text as string) || 'Explore Collection'
  const heroBtnLink = (hero.button_link as string) || '/shop'
  const heroImage = (hero.image_url as string) || 'https://picsum.photos/seed/japandi-hero/1200/800'
  const heroQuote = (hero.quote as string) || 'Simplicity is the ultimate sophistication.'

  // Featured values with fallbacks
  const featuredVisible = featured.visible !== false
  const featuredTitle = (featured.title as string) || 'Selected Arrivals'
  const featuredSubtitle = (featured.subtitle as string) || 'Pieces that bring calm to your space.'
  const viewAllText = (featured.view_all_text as string) || 'View All Items'
  const viewAllLink = (featured.view_all_link as string) || '/shop'

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero Section ────────────────────────────────── */}
      <section
        aria-label="Hero – Japan Surplus Philippines"
        className="relative w-full pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-border/40"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

            <div className="w-full md:w-5/12 z-10 flex flex-col items-start pt-6">
              <FadeIn delay={0.1}>
                <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase mb-6 block">
                  {heroSubtitle}
                </span>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-5xl md:text-7xl font-headline font-semibold tracking-tight text-primary mb-6 leading-[1.05]">
                  {heroTitle}
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-base md:text-lg text-foreground/70 mb-10 max-w-sm leading-relaxed font-medium">
                  {heroDescription}
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <Button
                  asChild
                  className="group bg-primary text-primary-foreground h-12 px-8 rounded-sm text-sm font-semibold tracking-wider uppercase hover:bg-foreground transition-all shadow-none flex items-center gap-3"
                >
                  <Link href={heroBtnLink}>
                    {heroBtnText}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </FadeIn>
            </div>

            <div className="w-full md:w-7/12 relative mt-8 md:mt-0">
              <FadeIn delay={0.3} direction="left">
                <div className="aspect-[4/5] md:aspect-[3/2] w-full relative overflow-hidden bg-secondary/20">
                  <Image
                    src={heroImage || 'https://picsum.photos/seed/japandi-hero/1200/800'}
                    alt="Japan surplus items collection at Jeany's Olshoppe – affordable quality finds in the Philippines"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                </div>
              </FadeIn>
              {/* Decorative Quote */}
              {heroQuote && (
                <FadeIn
                  delay={0.6}
                  direction="up"
                  className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/80 backdrop-blur-md hidden md:flex items-center justify-center p-8"
                >
                  <p className="text-xs font-serif italic text-foreground tracking-widest leading-loose text-center">
                    &ldquo;{heroQuote}&rdquo;
                  </p>
                </FadeIn>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Featured Products Section ────────────────────── */}
      {featuredVisible && (
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
                    {featuredTitle}
                  </h2>
                  <p className="text-muted-foreground font-medium text-sm">
                    {featuredSubtitle}
                  </p>
                </div>
                <Button
                  asChild
                  variant="link"
                  className="text-sm font-semibold uppercase tracking-widest text-accent hover:text-primary transition-colors p-0 h-auto"
                >
                  <Link href={viewAllLink}>{viewAllText}</Link>
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} direction="up">
              <ProductGrid products={featuredProducts || []} />
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Dynamic Custom Sections ──────────────────────── */}
      {dynamicSections && dynamicSections.length > 0 && (
        <DynamicHomeSections sections={dynamicSections} />
      )}

      {/* ── Contact Section ──────────────────────────────── */}
      <DynamicContactSection data={contact} />
    </div>
  );
}
