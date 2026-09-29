import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: { default: 'VYRO — Сучасний інтернет-магазин', template: '%s | VYRO' },
  description: 'VYRO — преміальний інтернет-магазин. Обирай, порівнюй, замовляй. Широкий каталог товарів з доставкою по Україні.',
  keywords: 'VYRO, інтернет-магазин, купити, доставка, Україна',
  openGraph: {
    siteName: 'VYRO',
    type: 'website',
    locale: 'uk_UA',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
