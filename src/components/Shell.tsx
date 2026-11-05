'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useSupplier } from '@/state/SupplierProvider';
import { Icon, type IconName } from './icons';
import { StorePicker } from './StorePicker';

const NAV: ReadonlyArray<{ href: string; label: string; icon: IconName; ownStore?: boolean }> = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/stores', label: '내 매장', icon: 'store', ownStore: true },
  { href: '/bookings', label: '예약', icon: 'calendar' },
  { href: '/settlement', label: '정산', icon: 'wallet' },
  { href: '/inquiries', label: '문의', icon: 'message' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state, clearStore } = useSupplier();
  const store = state.stores[0];
  const openCount = state.inquiries.filter((inquiry) => !state.notes.some((note) => note.inquiryId === inquiry.id)).length;

  if (!store) return <StorePicker />;

  return (
    <div className="shell">
      <aside className="sidenav">
        <Link href="/" className="brand">
          <img className="brand-logo" src="/took-logo.png" alt="took" />
          <span>
            <strong>TooK 공급사</strong>
            <em>예시 콘솔</em>
          </span>
        </Link>
        <nav aria-label="주요 메뉴">
          {NAV.map((item) => {
            const href = item.ownStore ? `/stores/${store.id}` : item.href;
            return (
              <Link key={item.label} href={href} className={`nav-link${isActive(pathname, href) ? ' is-active' : ''}`}>
                <Icon name={item.icon} />
                {item.label}
                {item.href === '/inquiries' && openCount > 0 ? <span className="nav-count">{openCount}</span> : null}
              </Link>
            );
          })}
        </nav>
        <p className="nav-note">금액과 메모는 이 기기에만 남아요.</p>
      </aside>
      <div className="main">
        <header className="app-header">
          <div>
            <p className="card-kicker">보고 있는 매장</p>
            <strong>{store.name}</strong>
          </div>
          <button type="button" className="btn btn-quiet" onClick={clearStore}>
            매장 바꾸기
          </button>
        </header>
        <p className="sample-banner">이 매장의 예시 화면입니다. 금액과 메모는 이 기기에만 남고, 매장이나 손님에게 전달되지 않아요.</p>
        {children}
      </div>
    </div>
  );
}
