import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import clsx from 'clsx';

import '@/styles/tailwind.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Use local version of Lexend so that we can use OpenType features
const lexend = localFont({
  src: '../fonts/lexend.woff2',
  display: 'swap',
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: {
    template: '%s - Docs',
    default: 'Codex',
  },
  description: 'Dokumentasjonsnettside for TIHLDE INDEX',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx('h-full antialiased', inter.variable, lexend.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full bg-white dark:bg-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
