import type { Metadata } from 'next';
import { ToastProvider } from '../components/ui/toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ProdigiEdits | Professional video editing, simplified',
    template: `%s | ProdigiEdits`,
  },
  description:
    'ProdigiEdits is a productized video-editing service for creators who need fast, high-quality edits.',
  keywords: ['video editing', 'video production', 'editing service', 'creator tools'],
  authors: [{ name: 'ProdigiEdits' }],
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
    <html lang="en" className="h-full">
      <body className="bg-white font-sans text-slate-900 antialiased h-full">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
