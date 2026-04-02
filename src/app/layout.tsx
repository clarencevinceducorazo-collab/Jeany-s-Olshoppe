import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { Inter, Alegreya } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const alegreya = Alegreya({ subsets: ['latin'], variable: '--font-alegreya' });

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
      <body className={`${inter.variable} ${alegreya.variable} font-sans antialiased text-[#4a403a]`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
