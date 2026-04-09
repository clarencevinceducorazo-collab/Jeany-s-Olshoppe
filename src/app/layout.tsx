import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { WelcomeModal } from "@/components/welcome-modal";
import "./globals.css";

import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-alegreya',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const siteUrl = 'https://jeanys-olshoppe.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jeany's Olshoppe – Japan Surplus & Quality Finds in the Philippines",
    template: "%s | Jeany's Olshoppe",
  },
  description: "Shop authentic Japan surplus items at Jeany's Olshoppe. Affordable, high-quality products with nationwide delivery across the Philippines.",
  keywords: [
    'Japan surplus Philippines',
    'affordable surplus items',
    "Jeany's Olshoppe",
    'quality surplus shop',
    'ukay ukay Philippines',
    'surplus shop Pangasinan',
    'Mapandan Pangasinan surplus',
    'Japan surplus online shop',
  ],
  authors: [{ name: "Jeany's Olshoppe" }],
  creator: "Jeany's Olshoppe",
  publisher: "Jeany's Olshoppe",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: siteUrl,
    siteName: "Jeany's Olshoppe",
    title: "Jeany's Olshoppe – Japan Surplus & Quality Finds in the Philippines",
    description: "Shop authentic Japan surplus items at Jeany's Olshoppe. Affordable, high-quality products with nationwide delivery across the Philippines.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Jeany's Olshoppe – Premium Japan Surplus Philippines",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Jeany's Olshoppe – Japan Surplus Philippines",
    description: "Affordable, high-quality Japan surplus items delivered nationwide in the Philippines.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: "Jeany's Olshoppe",
  description: "Philippines-based Japan surplus online shop offering affordable, high-quality products.",
  url: siteUrl,
  telephone: '+639076545313',
  email: 'jeanyrazo945@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mapandan',
    addressLocality: 'Mapandan',
    addressRegion: 'Pangasinan',
    addressCountry: 'PH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '15.9974',
    longitude: '120.4595',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Thursday', 'Friday'], opens: '11:00', closes: '17:00' },
  ],
  sameAs: [
    'https://www.facebook.com/profile.php?id=100064110249756',
  ],
  priceRange: '₱₱',
  currenciesAccepted: 'PHP',
  paymentAccepted: 'Cash, GCash',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains to reduce latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://picsum.photos" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${alegreya.variable} font-sans antialiased text-primary bg-background selection:bg-accent/20 selection:text-foreground`}>
        {children}
        <WelcomeModal />
        <Toaster />
      </body>
    </html>
  );
}
