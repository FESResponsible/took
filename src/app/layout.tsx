import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Shell } from '@/components/Shell';
import { SupplierProvider } from '@/state/SupplierProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'TooK 공급사',
  description: 'TooK 공급사용 예시 콘솔',
  icons: { icon: '/took-logo.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F1FBF8',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <SupplierProvider>
          <Shell>{children}</Shell>
        </SupplierProvider>
      </body>
    </html>
  );
}
