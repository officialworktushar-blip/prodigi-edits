import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CutCrew | Professional video editing, simplified',
    template: `%s | CutCrew`,
  },
  description:
    'CutCrew is a productized video-editing service for creators who need fast, high-quality edits.',
  keywords: ['video editing', 'video production', 'editing service', 'creator tools'],
  authors: [{ name: 'CutCrew' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="bg-white font-sans text-slate-900 antialiased h-full">
        {children}
      </body>
    </html>
  );
}
