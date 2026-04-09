import Link from 'next/link';
import { ExternalLink, Facebook, MessageCircle, MapPin, Star, Phone, Mail, Tv2, Heart } from 'lucide-react';

interface ActionButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  variant?: 'accent' | 'default' | 'muted';
}

function ActionButton({ href, icon, label, subtitle, variant = 'default' }: ActionButtonProps) {
  const colorMap = {
    accent: 'bg-accent/10 border-accent/30 hover:bg-accent/20 hover:border-accent/60 text-accent',
    default: 'bg-card border-border hover:border-foreground/30 hover:bg-secondary text-foreground',
    muted: 'bg-secondary/50 border-border/60 hover:bg-secondary hover:border-border text-foreground/80',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${colorMap[variant]}`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${variant === 'accent' ? 'bg-accent/20' : 'bg-secondary'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm tracking-wide">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
      </div>
      <ExternalLink className="shrink-0 w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 md:py-24 bg-secondary/30 border-t border-border/40"
    >
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase mb-3 block">
            Get In Touch
          </span>
          <h2 id="contact-heading" className="text-3xl font-headline font-semibold tracking-tight text-primary mb-3">
            Connect with Jeany&apos;s Olshoppe
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm font-medium">
            Watch us live, shop directly, or reach out — we&apos;re always here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Group 1: Live & Social */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-foreground/40 uppercase mb-4">Live & Social</h3>
            <div className="flex flex-col gap-3">
              <ActionButton
                href="https://www.facebook.com/profile.php?id=100064110249756"
                label="Watch Us on Facebook"
                subtitle="Live selling sessions daily"
                variant="accent"
                icon={<Tv2 className="w-5 h-5 text-accent" />}
              />
              <ActionButton
                href="https://www.facebook.com/100064110249756/support/?surface=page_top_cta_button&entrypoint_surface=page_top_cta_button"
                label="Subscribe / Support"
                subtitle="Support our page"
                variant="default"
                icon={<Heart className="w-5 h-5 text-foreground/70" />}
              />
              <ActionButton
                href="https://www.facebook.com/profile.php?id=100064110249756&sk=reviews"
                label="Read Our Reviews"
                subtitle="See what customers say"
                variant="muted"
                icon={<Star className="w-5 h-5 text-yellow-500" />}
              />
            </div>
          </div>

          {/* Group 2: Actions */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-foreground/40 uppercase mb-4">Actions</h3>
            <div className="flex flex-col gap-3">
              <ActionButton
                href="https://m.me/100064110249756?ref=WebsiteVisitor"
                label="Message via Messenger"
                subtitle="Chat with us directly"
                variant="accent"
                icon={<MessageCircle className="w-5 h-5 text-accent" />}
              />
              <ActionButton
                href="https://maps.app.goo.gl/mtaKXkw4Uzum44hT9"
                label="Find Us on Google Maps"
                subtitle="Mapandan, Pangasinan"
                variant="default"
                icon={<MapPin className="w-5 h-5 text-red-400" />}
              />
              <ActionButton
                href="https://www.facebook.com/profile.php?id=100064110249756"
                label="Visit Facebook Page"
                subtitle="Follow for updates"
                variant="muted"
                icon={<Facebook className="w-5 h-5 text-blue-400" />}
              />
            </div>
          </div>

          {/* Group 3: Contact */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-foreground/40 uppercase mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <ActionButton
                href="tel:+639076545313"
                label="Call Us"
                subtitle="0907 654 5313"
                variant="accent"
                icon={<Phone className="w-5 h-5 text-accent" />}
              />
              <ActionButton
                href="mailto:jeanyrazo945@gmail.com"
                label="Send an Email"
                subtitle="jeanyrazo945@gmail.com"
                variant="default"
                icon={<Mail className="w-5 h-5 text-foreground/70" />}
              />
            </div>

            {/* Location card */}
            <div className="mt-4 p-4 rounded-xl border border-border/60 bg-card">
              <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Location</p>
              <p className="text-sm font-semibold text-primary leading-relaxed">
                Mapandan, Pangasinan<br />
                <span className="font-normal text-muted-foreground">Philippines</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
