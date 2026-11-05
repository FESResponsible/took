'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePartner } from '@/state/PartnerProvider';
import { Icon, type IconName } from './icons';

const ITEMS: ReadonlyArray<{ href: string; label: string; icon: IconName }> = [
  { href: '/', label: '오늘', icon: 'home' },
  { href: '/bookings', label: '예약', icon: 'calendar' },
  { href: '/settlement', label: '정산', icon: 'wallet' },
  { href: '/settings', label: '설정', icon: 'sliders' },
  { href: '/support', label: '문의', icon: 'message' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { state } = usePartner();
  const pendingCount = state.bookings.filter((b) => b.status === 'pending_approval').length;

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {ITEMS.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'is-active' : ''}`} aria-current={isActive ? 'page' : undefined}>
            <span className="nav-icon">
              <Icon name={item.icon} size={20} />
              {item.href === '/bookings' && pendingCount > 0 && (
                <span className="nav-badge" aria-label={`확인 필요 ${pendingCount}건`}>
                  {pendingCount}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
