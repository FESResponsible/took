import type { ReactNode, SVGProps } from 'react';

export type IconName =
  | 'home'
  | 'calendar'
  | 'wallet'
  | 'sliders'
  | 'message'
  | 'bell'
  | 'settings'
  | 'qr'
  | 'bag'
  | 'search'
  | 'user'
  | 'chevron'
  | 'chevronLeft'
  | 'camera'
  | 'image';

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M4 10h16" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 10h13a2 2 0 0 1 2 2v1" />
      <circle cx="16.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 8h16M4 16h16" />
      <circle cx="9" cy="8" r="2" fill="var(--card, #fff)" />
      <circle cx="15" cy="16" r="2" fill="var(--card, #fff)" />
    </>
  ),
  message: (
    <>
      <path d="M6 18.5 4 21V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8A2.5 2.5 0 0 1 17.5 17H8l-2 1.5Z" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16h12l-1.2-2.1a6.2 6.2 0 0 1-.8-3.1V9.2A4 4 0 0 0 12 5.2 4 4 0 0 0 8 9.2v1.6c0 1.1-.3 2.2-.8 3.1L6 16Z" />
      <path d="M10 16a2 2 0 0 0 4 0" />
    </>
  ),
  settings: (
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      d="M10.1 2.7h3.8l.6 2.2c.6.2 1.1.5 1.6.9l2.1-1 2.6 2.6-1 2.1c.4.5.7 1 .9 1.6l2.2.6v3.8l-2.2.6c-.2.6-.5 1.1-.9 1.6l1 2.1-2.6 2.6-2.1-1c-.5.4-1 .7-1.6.9l-.6 2.2h-3.8l-.6-2.2a6 6 0 0 1-1.6-.9l-2.1 1-2.6-2.6 1-2.1a6 6 0 0 1-.9-1.6l-2.2-.6V9.7l2.2-.6c.2-.6.5-1.1.9-1.6l-1-2.1 2.6-2.6 2.1 1c.5-.4 1-.7 1.6-.9l.6-2.2Zm1.9 6.1a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
    />
  ),
  qr: (
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      d="M4 4h6.2v6.2H4V4Zm1.6 1.6v3h3v-3h-3ZM13.8 4H20v6.2h-6.2V4Zm1.6 1.6v3h3v-3h-3ZM4 13.8h6.2V20H4v-6.2Zm1.6 1.6v3h3v-3h-3ZM13.8 13.8h2.2v2.2h-2.2v-2.2Zm4 0H20v2.2h-2.2v-2.2ZM13.8 17.8h2.2V20h-2.2v-2.2Zm4 0H20V20h-2.2v-2.2ZM13.8 10.4h2.2v2h-2.2v-2Zm4 0H20v2h-2.2v-2ZM10.2 13.8h2.2v2h-2.2v-2Z"
    />
  ),
  bag: (
    <>
      <rect x="6" y="7" width="12" height="13" rx="2" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.6 19.2c1.3-2.8 3.4-4.2 6.4-4.2s5.1 1.4 6.4 4.2" />
    </>
  ),
  chevron: <path d="m9.5 6 6 6-6 6" />,
  chevronLeft: <path d="m14.5 6-6 6 6 6" />,
  camera: (
    <>
      <path d="M4 8.5h3.2l1.4-2h6.8l1.4 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z" />
      <circle cx="12" cy="14" r="3" />
    </>
  ),
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <path d="m4 15 4.2-3.6 3.2 2.8 2.4-2 5.2 4.4" />
    </>
  ),
};

export function Icon({ name, size = 22, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
