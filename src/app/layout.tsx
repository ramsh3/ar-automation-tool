// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

// DM Mono isn't in next/font/google, import via CSS or use variable font
// Option: keep DM Mono in globals.css @import separately since it's only used for code/numbers

export const metadata: Metadata = {
  title: 'Agilysys AR Buddy',
  description: 'Accounts Receivable Customer Portal',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}