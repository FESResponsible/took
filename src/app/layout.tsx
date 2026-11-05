import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';
import { PartnerProvider } from '@/state/PartnerProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'TooK 파트너',
  description: 'TooK 짐 보관 파트너 매장용 관리 화면',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <PartnerProvider>
          <AppShell>{children}</AppShell>
        </PartnerProvider>
      </body>
    </html>
  );
}

