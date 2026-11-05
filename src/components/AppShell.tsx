'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { toDateKey } from '@/domain/time';
import { usePartner } from '@/state/PartnerProvider';
import { Icon } from './icons';
import { NoticeToast } from './NoticeToast';

export function AppShell({ children }: { children: ReactNode }) {
  const { state, dispatch, now, saveError } = usePartner();
  const todayKey = toDateKey(now);
  const isPaused = state.settings.pausedOn === todayKey;
  const pending = state.bookings.filter((booking) => booking.status === 'pending_approval').length;
  const pathname = usePathname();
  const inThread = pathname.startsWith('/chats/') && pathname.length > '/chats/'.length;

  return (
    <div className={`shell${inThread ? ' is-thread' : ''}`}>
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src="/took-logo.png" alt="took" />
          <p className="store-name">{state.store.name}</p>
        </div>
        <div className="top-actions">
          <Link href="/bookings" className="icon-btn" aria-label={pending > 0 ? `예약 알림, 확인 필요 ${pending}건` : '예약 알림'}>
            <Icon name="bell" size={20} />
            {pending > 0 ? <span className="icon-dot">{pending}</span> : null}
          </Link>
          <Link href="/settings" className="icon-btn" aria-label="설정">
            <Icon name="settings" size={20} />
          </Link>
        </div>
      </header>
      <button
        type="button"
        className={`notice-card ${isPaused ? 'is-paused' : ''}`}
        aria-pressed={!isPaused}
        onClick={() => dispatch({ type: 'toggle_pause', dateKey: todayKey })}
      >
        <span>
          <strong>{isPaused ? '오늘 예약 멈춤' : '오늘 예약 받는 중'}</strong>
          <span className="notice-sub">{isPaused ? '새 예약을 받지 않아요' : '조건 안 예약은 자동 확정'}</span>
        </span>
        <span className="notice-pill">{isPaused ? '다시 받기' : '멈추기'}</span>
      </button>
      {saveError && (
        <p className="banner banner-error" role="alert">
          {saveError}
        </p>
      )}
      <main className="content">{children}</main>
      <NoticeToast />
    </div>
  );
}
