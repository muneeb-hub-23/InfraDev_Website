import type { Metadata, Viewport } from 'next';
import { Inter, Rajdhani } from 'next/font/google';
import { colorVars } from '@/lib/color';
import { getSettings } from '@/lib/settings';
import { DEFAULT_SETTINGS } from '@/lib/settings-schema';
import './globals.css';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-inter', display: 'swap' });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-rajdhani', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(s.website);
  } catch {}
  const title = s.metaTitle || `${s.companyName} – ${s.tagline}`;
  return {
    metadataBase,
    title,
    description: s.metaDescription,
    keywords: s.metaKeywords,
    authors: [{ name: s.companyName }],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: s.metaDescription,
      type: 'website',
      images: s.logo ? [s.logo] : undefined,
    },
    icons: {
      icon: s.favicon || '/favicon.ico',
      apple: '/icons/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
  };
}

export async function generateViewport(): Promise<Viewport> {
  const s = await getSettings();
  return { themeColor: s.brandColor };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const vars = colorVars(s.brandColor, s.accentColor, { brand: DEFAULT_SETTINGS.brandColor, accent: DEFAULT_SETTINGS.accentColor });
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`} style={vars}>
      <body>{children}</body>
    </html>
  );
}
