'use client';

import { useState } from 'react';
import { Play, Calendar, Clock, Radio, ExternalLink, MapPin } from 'lucide-react';
import { FadeIn } from '@/components/animations/fade-in';
import { cn } from '@/lib/utils';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100064110249756';

const schedule = [
  { day: 'Monday',    short: 'Mon', hours: '11:00 AM – 5:00 PM', active: true },
  { day: 'Tuesday',   short: 'Tue', hours: '11:00 AM – 5:00 PM', active: true },
  { day: 'Wednesday', short: 'Wed', hours: 'Rest Day',            active: false },
  { day: 'Thursday',  short: 'Thu', hours: '11:00 AM – 5:00 PM', active: true },
  { day: 'Friday',    short: 'Fri', hours: '11:00 AM – 5:00 PM', active: true },
  { day: 'Saturday',  short: 'Sat', hours: 'Rest Day',            active: false },
  { day: 'Sunday',    short: 'Sun', hours: 'Rest Day',            active: false },
];

// Detect current day to highlight it
const TODAY_INDEX = new Date().getDay(); // 0=Sun, 1=Mon...
const DAY_MAP: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
};
const TODAY_NAME = DAY_MAP[TODAY_INDEX];

export default function LivePageClient() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ═══ HERO SECTION ══════════════════════════════════════════════════ */}
      <section
        aria-label="Live selling hero"
        className="relative w-full overflow-hidden"
        style={{ minHeight: 'clamp(260px, 55vw, 420px)' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: imgError
              ? 'linear-gradient(135deg, #1a0808 0%, #3d0c0c 100%)'
              : 'url("https://picsum.photos/seed/japansurplus/1920/1080")',
          }}
          aria-hidden="true"
        />

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" aria-hidden="true" />

        {/* LIVE badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
          <span className="text-white text-[11px] font-bold tracking-widest uppercase">Live</span>
        </div>

        {/* Hero content — vertically centred */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full px-5 pt-14 pb-8 text-center"
          style={{ minHeight: 'inherit' }}
        >
          <FadeIn delay={0.1}>
            {/* Animated live icon */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch us live on Facebook"
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-[0_0_32px_rgba(220,38,38,0.55)] mb-5 border-4 border-red-500/30"
            >
              <Play className="w-7 h-7 text-white ml-1" />
            </a>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-semibold text-white tracking-tight mb-2 drop-shadow-lg">
              Watch Live Selling
            </h1>

            <p className="text-white/75 text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
              Japan Surplus finds — live every day on Facebook. Shop in real-time!
            </p>

            {/* Time chip */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 mt-4">
              <Clock className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
              <span className="text-white/90 text-xs font-semibold tracking-wide">11:00 AM – 5:00 PM daily</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ STICKY WATCH LIVE CTA ════════════════════════════════════════ */}
      <div className="sticky top-[72px] md:top-[80px] z-30 px-4 py-3 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl text-white font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-red-600/25"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
          Watch Live Now on Facebook
          <ExternalLink className="w-4 h-4 shrink-0" />
        </a>
      </div>

      {/* ═══ SCHEDULE SECTION ═════════════════════════════════════════════ */}
      <section aria-labelledby="schedule-heading" className="py-8 md:py-16 px-4 bg-background">
        <div className="max-w-2xl mx-auto">

          {/* Section header */}
          <FadeIn direction="up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0" aria-hidden="true">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 id="schedule-heading" className="text-lg font-semibold tracking-tight text-foreground">
                  Weekly Broadcast Schedule
                </h2>
                <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  Mapandan, Pangasinan, Philippines
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Schedule cards — single column stack on mobile */}
          <FadeIn direction="up" delay={0.1}>
            <div className="flex flex-col gap-2.5">
              {schedule.map((slot) => {
                const isToday = slot.day === TODAY_NAME;
                return (
                  <div
                    key={slot.day}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all',
                      slot.active
                        ? isToday
                          ? 'bg-accent/10 border-accent/30 shadow-sm'
                          : 'bg-card border-border shadow-sm'
                        : 'bg-secondary/20 border-border/30 opacity-50'
                    )}
                  >
                    {/* Day + Today badge */}
                    <div className="w-[72px] shrink-0">
                      <p className={cn(
                        'font-bold text-sm',
                        isToday ? 'text-accent' : slot.active ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {slot.day}
                      </p>
                      {isToday && (
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">Today</span>
                      )}
                    </div>

                    {/* Time */}
                    <div className="flex-1">
                      {slot.active ? (
                        <p className={cn(
                          'text-sm font-semibold',
                          isToday ? 'text-accent' : 'text-foreground/80'
                        )}>
                          {slot.hours}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground font-medium">Rest Day</p>
                      )}
                    </div>

                    {/* Status dot */}
                    {slot.active ? (
                      <span className="flex h-2.5 w-2.5 shrink-0 relative">
                        {isToday && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70" />}
                        <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', isToday ? 'bg-green-500' : 'bg-green-400/50')} />
                      </span>
                    ) : (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* Note */}
          <p className="text-center text-muted-foreground text-xs mt-6">
            Live sessions run Mon, Tue, Thu & Fri · Times are Philippine Standard Time (PHT)
          </p>
        </div>
      </section>

      {/* ═══ SPACER for bottom nav ═════════════════════════════════════════ */}
      <div className="h-8 md:h-0" aria-hidden="true" />

    </div>
  );
}
