import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "ReelPick | AI-Powered Shoppable Reels",
  description: "The ultimate short-form video shopping experience for Gen-Z. Viral reels meet seamless checkout.",
  openGraph: {
    title: "ReelPick | AI-Powered Shoppable Reels",
    description: "The ultimate short-form video shopping experience for Gen-Z. Viral reels meet seamless checkout.",
    url: 'https://reelpick.shop',
    siteName: 'ReelPick',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&h=630&auto=format&fit=crop',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReelPick | AI-Powered Shoppable Reels',
    description: 'The ultimate short-form video shopping experience for Gen-Z.',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&h=630&auto=format&fit=crop'],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, outfit.variable, mono.variable)}>
      <body className="antialiased font-sans">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
