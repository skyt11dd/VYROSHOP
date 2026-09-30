import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: { default: 'VYRO — Вейп Шоп | POD-системи, Рідини, Одноразки', template: '%s | VYRO' },
  description: 'VYRO — офіційний вейп шоп. Преміальні POD-системи, сольові рідини, одноразки та картриджі з швидкою доставкою по Україні. 18+',
  keywords: 'VYRO, вейп шоп, pod-системи, сольові рідини, одноразки, картриджі, vape, купити pod',
  openGraph: {
    siteName: 'VYRO Vape Shop',
    type: 'website',
    locale: 'uk_UA',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  robots: { index: true, follow: true },
};

import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <MobileBottomNav />
            <AgeGate />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
