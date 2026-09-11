import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sharon Lost + Found',
  description: 'A neighborly place to reunite Sharon residents with their things.',
  metadataBase: new URL('https://sharonlostandfound.viraat.dev'),
  openGraph: {
    title: 'Sharon Lost + Found',
    description: 'Lost something at Sharon?',
    url: 'https://sharonlostandfound.viraat.dev',
    siteName: 'Sharon Lost + Found',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sharon Lost + Found',
    description: 'Lost something at Sharon?',
  },
};

export const viewport: Viewport = {
  themeColor: '#f5f0e6',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
