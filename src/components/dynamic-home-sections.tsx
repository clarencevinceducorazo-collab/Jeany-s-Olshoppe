import Image from 'next/image'
import { FadeIn } from '@/components/animations/fade-in'

interface HomeSection {
  id: string
  title: string
  description: string | null
  image_url: string | null
  layout: string
  sort_order: number
  visible: boolean
}

export function DynamicHomeSections({ sections }: { sections: HomeSection[] }) {
  return (
    <div className="w-full">
      {sections.map((section) => {
        if (section.layout === 'banner') {
          return <BannerSection key={section.id} section={section} />
        }
        if (section.layout === 'grid') {
          return <GridSection key={section.id} section={section} />
        }
        return <TextOnlySection key={section.id} section={section} />
      })}
    </div>
  )
}

// ── Banner Layout ─────────────────────────────────────────────────

function BannerSection({ section }: { section: HomeSection }) {
  return (
    <section
      aria-label={section.title}
      className="relative w-full py-20 md:py-28 overflow-hidden border-b border-border/40"
    >
      {section.image_url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={section.image_url}
            alt={section.title}
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
      )}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <FadeIn>
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-headline font-semibold tracking-tight text-primary mb-4 leading-tight">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
                {section.description}
              </p>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ── Grid Layout ───────────────────────────────────────────────────

function GridSection({ section }: { section: HomeSection }) {
  return (
    <section
      aria-label={section.title}
      className="py-16 md:py-24 bg-secondary/20 border-b border-border/40"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {section.image_url && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/40">
                <Image
                  src={section.image_url}
                  alt={section.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <div className={section.image_url ? '' : 'md:col-span-2'}>
              <h2 className="text-3xl font-headline font-semibold tracking-tight text-primary mb-4">
                {section.title}
              </h2>
              {section.description && (
                <p className="text-foreground/70 leading-relaxed">
                  {section.description}
                </p>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ── Text-Only Layout ──────────────────────────────────────────────

function TextOnlySection({ section }: { section: HomeSection }) {
  return (
    <section
      aria-label={section.title}
      className="py-14 md:py-20 border-b border-border/40"
    >
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-headline font-semibold tracking-tight text-primary mb-4">
            {section.title}
          </h2>
          {section.description && (
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
              {section.description}
            </p>
          )}
          {section.image_url && (
            <div className="relative w-full max-w-md mx-auto mt-8 aspect-[3/2] rounded-xl overflow-hidden border border-border/40">
              <Image
                src={section.image_url}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  )
}
