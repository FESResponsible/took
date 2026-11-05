import type { ReactNode, SVGProps } from 'react';

export type IconName = 'home' | 'store' | 'calendar' | 'wallet' | 'message';

const PATHS: Record<IconName, ReactNode> = {
  home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />,
  store: (
    <>
      <path d="M4 9h16l-1.2 10.2a1 1 0 0 1-1 .8H6.2a1 1 0 0 1-1-.8z" />
      <path d="M8 9V7a4 4 0 0 1 8 0v2" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5V7M16 3.5V7M4 10h16" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  message: <path d="M5 6h14a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />,
};

export function Icon({ name, size = 18, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {PATHS[name]}
    </svg>
  );
}
