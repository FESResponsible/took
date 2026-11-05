import type { ReactNode } from 'react';

export type AppMarkName = 'bag' | 'coins' | 'clock' | 'chat' | 'qr' | 'locker' | 'visit' | 'check' | 'miss';

const MARKS: Record<AppMarkName, ReactNode> = {
  bag: (
    <>
      <path d="M12.2 12.4V10a3.8 3.8 0 0 1 7.6 0v2.4h-2.1V10a1.7 1.7 0 0 0-3.4 0v2.4h-2.1Z" fill="#0B8F7C" />
      <rect x="7" y="12" width="18" height="14" rx="3.2" fill="#08CBAA" />
      <rect x="10.5" y="16" width="11" height="4.2" rx="1.3" fill="#FFF2AE" />
      <circle cx="11" cy="26.2" r="1.3" fill="#213A3C" />
      <circle cx="21" cy="26.2" r="1.3" fill="#213A3C" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="13" cy="21.2" rx="8" ry="3" fill="#E0A91A" />
      <ellipse cx="13" cy="19.2" rx="8" ry="3" fill="#FFE38A" />
      <ellipse cx="19.2" cy="14.6" rx="7.2" ry="2.8" fill="#E8B423" />
      <ellipse cx="19.2" cy="12.6" rx="7.2" ry="2.8" fill="#FFF6C8" />
      <circle cx="19.2" cy="12.6" r="1.35" fill="#C89212" />
    </>
  ),
  clock: (
    <>
      <circle cx="16" cy="16" r="11" fill="#3EC8D8" />
      <circle cx="16" cy="16" r="8" fill="#FFFFFF" />
      <rect x="15.2" y="6.4" width="1.6" height="2.6" rx="0.6" fill="#213A3C" />
      <rect x="23" y="15.2" width="2.6" height="1.6" rx="0.6" fill="#213A3C" />
      <rect x="15.2" y="23" width="1.6" height="2.6" rx="0.6" fill="#213A3C" />
      <rect x="6.4" y="15.2" width="2.6" height="1.6" rx="0.6" fill="#213A3C" />
      <path d="M16 16.4 12.2 12.2" stroke="#213A3C" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 16.4 20.6 12.8" stroke="#213A3C" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="16.4" r="1.5" fill="#00B9C8" />
    </>
  ),
  chat: (
    <>
      <rect x="5" y="7" width="22" height="14" rx="6" fill="#6E8DFF" />
      <path d="M10 20.2c.2 2.6-1.4 4.2.6 4.2 2.4 0 3.2-2.4 3.2-4.2H10Z" fill="#6E8DFF" />
      <circle cx="11.5" cy="14" r="1.45" fill="#FFFFFF" />
      <circle cx="16" cy="14" r="1.45" fill="#FFFFFF" />
      <circle cx="20.5" cy="14" r="1.45" fill="#FFFFFF" />
    </>
  ),
  qr: (
    <>
      <rect x="5" y="5" width="9" height="9" rx="2" fill="#213A3C" />
      <rect x="7.2" y="7.2" width="4.6" height="4.6" rx="0.8" fill="#FFFFFF" />
      <rect x="18" y="5" width="9" height="9" rx="2" fill="#213A3C" />
      <rect x="20.2" y="7.2" width="4.6" height="4.6" rx="0.8" fill="#FFFFFF" />
      <rect x="5" y="18" width="9" height="9" rx="2" fill="#213A3C" />
      <rect x="7.2" y="20.2" width="4.6" height="4.6" rx="0.8" fill="#FFFFFF" />
      <rect x="18" y="18" width="3.2" height="3.2" rx="0.6" fill="#08CBAA" />
      <rect x="22.2" y="18" width="4.8" height="3.2" rx="0.6" fill="#213A3C" />
      <rect x="18" y="22.2" width="3.2" height="4.8" rx="0.6" fill="#213A3C" />
      <rect x="22.2" y="22.6" width="4.8" height="4.4" rx="0.8" fill="#08CBAA" />
    </>
  ),
  locker: (
    <>
      <rect width="32" height="32" rx="10" fill="#D7F6F0" />
      <rect x="8" y="13" width="16" height="12" rx="2.6" fill="#08CBAA" />
      <path d="M13 13V11.4a3 3 0 0 1 6 0V13h-1.8v-1.6a1.2 1.2 0 0 0-2.4 0V13H13Z" fill="#0B8F7C" />
      <rect x="12" y="17" width="8" height="3" rx="1" fill="#FFF2AE" />
    </>
  ),
  visit: (
    <>
      <rect width="32" height="32" rx="10" fill="#D8F6FA" />
      <rect x="8" y="9" width="16" height="15" rx="3" fill="#FFFFFF" />
      <path d="M8 12.2h16v-0.2A3 3 0 0 0 21 9H11a3 3 0 0 0-3 3v.2Z" fill="#00B9C8" />
      <circle cx="16" cy="18.2" r="2.1" fill="#08CBAA" />
    </>
  ),
  check: (
    <>
      <rect width="32" height="32" rx="10" fill="#FFF4C2" />
      <circle cx="16" cy="16" r="8" fill="#FFFFFF" />
      <path d="M12.1 16.3 14.6 18.8 20.2 13" fill="none" stroke="#213A3C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  miss: (
    <>
      <rect width="32" height="32" rx="10" fill="#FDECEA" />
      <circle cx="16" cy="16" r="8" fill="#E7A19C" />
      <circle cx="16" cy="16" r="5.6" fill="#FFFFFF" />
      <path d="M16 16.2 13.2 12.6" stroke="#9C2F2A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 16.2 19.6 13.2" stroke="#9C2F2A" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="16.2" r="1.3" fill="#9C2F2A" />
    </>
  ),
};

export function AppMark({ name, size = 30 }: { name: AppMarkName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {MARKS[name]}
    </svg>
  );
}
