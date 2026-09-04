import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AnimeTok — Platform Klip Video Pendek Anime & Wibu',
  description: 'Nonton klip anime terbaik, editan epic AMV, highlight pertarungan, dan meme anime dalam format vertical feed pendek ala TikTok.',
  keywords: ['anime', 'animetok', 'anime clips', 'tiktok anime', 'amv', 'jujutsu kaisen', 'demon slayer', 'short video'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050507',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
