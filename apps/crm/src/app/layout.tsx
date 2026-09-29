import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: { default: 'VYRO CRM', template: '%s | VYRO CRM' },
  description: 'VYRO CRM — система управління магазином',
  robots: { index: false, follow: false },
};

export default function CrmRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
