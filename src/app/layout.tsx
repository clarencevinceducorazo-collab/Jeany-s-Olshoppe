import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({ 
  subsets: ['latin'], 
  variable: '--font-alegreya',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Jeanys Olshoppe",
  description: "Your favorite Japan surplus online shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${alegreya.variable} font-sans antialiased text-primary bg-background selection:bg-accent/20 selection:text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
