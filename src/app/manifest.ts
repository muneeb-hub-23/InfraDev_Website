import type { MetadataRoute } from 'next';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return {
    name: s.companyName,
    short_name: s.companyName,
    description: `${s.companyName} – ${s.tagline}`,
    icons: [
      { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: s.brandColor,
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
  };
}
