import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agilysys AR Buddy',
  description: 'Accounts Receivable Customer Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
