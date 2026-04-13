import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/get-user-role'
import { HeroEditor } from './hero-editor'
import { FeaturedEditor } from './featured-editor'
import { AboutEditor } from './about-editor'
import { ContactEditor } from './contact-editor'
import { DynamicSectionsEditor } from './dynamic-sections-editor'
import {
  Home, Sparkles, Info, Phone, LayoutPanelLeft, Eye
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePageManagerPage() {
  if (!(await isAdmin())) redirect('/login')

  const supabase = await createClient()

  // Fetch all fixed sections
  const { data: contentRows } = await supabase
    .from('home_content')
    .select('id, data')

  const contentMap: Record<string, Record<string, unknown>> = {}
  for (const row of contentRows || []) {
    contentMap[row.id] = row.data
  }

  // Fetch dynamic sections
  const { data: dynamicSections } = await supabase
    .from('home_sections')
    .select('*')
    .order('sort_order', { ascending: true })

  const hero = contentMap['hero'] || {}
  const featured = contentMap['featured'] || {}
  const about = contentMap['about'] || {}
  const contact = contentMap['contact'] || {}

  const tabs = [
    { id: 'hero', label: 'Hero', icon: Home },
    { id: 'featured', label: 'Featured', icon: Sparkles },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'dynamic', label: 'Dynamic Sections', icon: LayoutPanelLeft },
  ]

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Home className="w-6 h-6 text-accent" />
            Home Page Manager
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Edit your home page content without redeploying. Changes go live instantly.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-white/40 hover:text-accent transition-colors border border-white/10 hover:border-accent/30 rounded-lg px-3 py-2"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview Home
        </Link>
      </div>

      {/* Tab Navigation using URL hash approach — pure server component compatible */}
      <HomeTabs
        tabs={tabs}
        hero={hero}
        featured={featured}
        about={about}
        contact={contact}
        dynamicSections={dynamicSections || []}
      />
    </div>
  )
}

// ─── Tab Container ─────────────────────────────────────────────────

function HomeTabs({
  tabs,
  hero,
  featured,
  about,
  contact,
  dynamicSections,
}: {
  tabs: { id: string; label: string; icon: React.ElementType }[]
  hero: Record<string, unknown>
  featured: Record<string, unknown>
  about: Record<string, unknown>
  contact: Record<string, unknown>
  dynamicSections: {
    id: string
    title: string
    description: string | null
    image_url: string | null
    layout: string
    sort_order: number
    visible: boolean
  }[]
}) {
  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-1 mb-6 border-b border-white/5 overflow-x-auto pb-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/50 hover:text-white border-b-2 border-transparent hover:border-accent/60 transition-all whitespace-nowrap -mb-px"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </a>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {/* Hero */}
        <section id="hero" className="scroll-mt-6">
          <SectionCard
            title="Hero Section"
            description="The main banner visitors see first — title, description, CTA button, and background image."
            icon={Home}
            color="accent"
          >
            <HeroEditor initialData={hero} />
          </SectionCard>
        </section>

        {/* Featured */}
        <section id="featured" className="scroll-mt-6">
          <SectionCard
            title="Featured / Selected Arrivals"
            description="Controls the product grid section shown on the home page."
            icon={Sparkles}
            color="yellow"
          >
            <FeaturedEditor initialData={featured} />
          </SectionCard>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-6">
          <SectionCard
            title="About / Branding"
            description="The wabi-sabi brand description block shown alongside your image."
            icon={Info}
            color="blue"
          >
            <AboutEditor initialData={about} />
          </SectionCard>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-6">
          <SectionCard
            title="Contact / Get In Touch"
            description="All contact details rendered in the footer contact section."
            icon={Phone}
            color="green"
          >
            <ContactEditor initialData={contact} />
          </SectionCard>
        </section>

        {/* Dynamic */}
        <section id="dynamic" className="scroll-mt-6">
          <SectionCard
            title="Dynamic Sections"
            description="Add, edit, reorder, or remove custom sections that appear below the featured products."
            icon={LayoutPanelLeft}
            color="purple"
          >
            <DynamicSectionsEditor initialSections={dynamicSections} />
          </SectionCard>
        </section>
      </div>
    </div>
  )
}

// ─── Section Card Wrapper ──────────────────────────────────────────

const colorMap: Record<string, string> = {
  accent: 'text-accent border-accent/20 bg-accent/5',
  yellow: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
  blue: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
  green: 'text-green-400 border-green-400/20 bg-green-400/5',
  purple: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
}

const iconBgMap: Record<string, string> = {
  accent: 'bg-accent/10',
  yellow: 'bg-yellow-400/10',
  blue: 'bg-blue-400/10',
  green: 'bg-green-400/10',
  purple: 'bg-purple-400/10',
}

function SectionCard({
  title,
  description,
  icon: Icon,
  color,
  children,
}: {
  title: string
  description: string
  icon: React.ElementType
  color: string
  children: React.ReactNode
}) {
  const cls = colorMap[color] || colorMap['accent']
  const iconBg = iconBgMap[color] || iconBgMap['accent']

  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
      {/* Card Header */}
      <div className={`border-b border-white/5 p-5 flex items-center gap-4`}>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${cls.split(' ')[0]}`} />
        </div>
        <div>
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <p className="text-white/40 text-xs mt-0.5">{description}</p>
        </div>
      </div>
      {/* Card Body */}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
