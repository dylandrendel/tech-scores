import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Rethink_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const rethink = Rethink_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tech Scores',
  description: 'Get the latest trends in tech jobs and skills',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rethink.className}>{children}</body>
    </html>
  );
}
