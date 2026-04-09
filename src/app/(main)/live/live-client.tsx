'use client';

import { Play, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/fade-in';
import { cn } from '@/lib/utils';

export default function LivePageClient() {
  const schedule = [
    { day: 'Monday', hours: '11:00 AM – 5:00 PM', active: true },
    { day: 'Tuesday', hours: '11:00 AM – 5:00 PM', active: true },
    { day: 'Wednesday', hours: 'Rest Day', active: false },
    { day: 'Thursday', hours: '11:00 AM – 5:00 PM', active: true },
    { day: 'Friday', hours: '11:00 AM – 5:00 PM', active: true },
    { day: 'Saturday', hours: 'Rest Day', active: false },
    { day: 'Sunday', hours: 'Rest Day', active: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Live TV Player UI Section */}
      <section
        aria-label="Live selling broadcast player"
        className="relative w-full aspect-video md:aspect-[21/9] max-h-[70vh] bg-black overflow-hidden flex items-center justify-center"
      >
        {/* Placeholder Video Background */}
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://picsum.photos/seed/japansurplus/1920/1080")' }}
          aria-hidden="true"
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" aria-hidden="true" />

        {/* Red Live Indicator Top Left */}
        <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10 z-10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          <span className="text-white text-xs font-bold tracking-widest uppercase">Live Demo</span>
        </div>

        {/* Center Play UI */}
        <FadeIn delay={0.2} className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6 animate-pulse">
            <Button
              size="icon"
              asChild
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-[0_0_40px_rgba(220,38,38,0.5)] border-none transition-transform hover:scale-105"
              aria-label="Watch us live on Facebook"
            >
              <a
                href="https://www.facebook.com/profile.php?id=100064110249756"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="w-8 h-8 md:w-10 md:h-10 ml-2" />
              </a>
            </Button>
          </div>

          <h1 className="text-3xl md:text-5xl font-headline font-semibold text-white tracking-tight mb-4 drop-shadow-md">
            Watch Live Selling
          </h1>
          <p className="text-white/80 max-w-md mx-auto text-sm md:text-base font-medium">
            Join Jeany&apos;s Olshoppe daily live sessions on Facebook to discover exclusive Japan Surplus items, shop in real-time, and chat directly with us!
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <Clock className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-white text-sm font-semibold tracking-wide">Live sessions: 11:00 AM – 4:00 PM</span>
          </div>

          {/* Go Live CTA */}
          <a
            href="https://www.facebook.com/profile.php?id=100064110249756"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-full tracking-wider uppercase transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Go Live on Facebook
          </a>
        </FadeIn>
      </section>

      {/* Schedule Section */}
      <section
        aria-labelledby="schedule-heading"
        className="py-16 md:py-24 bg-background"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn direction="up">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center" aria-hidden="true">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 id="schedule-heading" className="text-2xl font-semibold tracking-tight text-primary">
                  Weekly Broadcast Schedule
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                  Plan your week around our live sessions. Located in Mapandan, Pangasinan, Philippines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {schedule.map((slot) => (
                <div
                  key={slot.day}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-300 text-center',
                    slot.active
                      ? 'bg-card border-border shadow-sm hover:shadow-md hover:-translate-y-1'
                      : 'bg-secondary/20 border-border/40 opacity-60'
                  )}
                >
                  <h3 className={cn(
                    'text-sm font-semibold mb-2',
                    slot.active ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    {slot.day}
                  </h3>
                  <p className={cn(
                    'text-xs font-medium leading-relaxed',
                    slot.active ? 'text-accent' : 'text-muted-foreground/60'
                  )}>
                    {slot.active ? (
                      <>
                        11:00 AM<br />–<br />5:00 PM
                      </>
                    ) : 'Rest Day'}
                  </p>
                  {slot.active && (
                    <span className="mt-2 flex h-2 w-2 relative mx-auto">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
