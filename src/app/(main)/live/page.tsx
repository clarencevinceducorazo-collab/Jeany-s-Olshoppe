import type { Metadata } from 'next';
import LivePageClient from './live-client';

export const metadata: Metadata = {
  title: "Live Selling – Watch Jeany's Olshoppe Live",
  description: "Watch Jeany's Olshoppe live selling sessions! Discover Japan surplus items in real-time. Live daily Monday–Friday, 11:00 AM – 5:00 PM. Located in Mapandan, Pangasinan, Philippines.",
  openGraph: {
    title: "Watch Live – Jeany's Olshoppe Japan Surplus Philippines",
    description: "Tune in for live selling sessions featuring affordable Japan surplus items. Available Monday–Friday, 11AM–5PM.",
  },
};

export default function LivePage() {
  return <LivePageClient />;
}
