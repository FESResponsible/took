'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookingCard } from '@/components/BookingCard';
import { Icon, type IconName } from '@/components/icons';
import { monthPeriod, summarizeSettlement } from '@/domain/settlement';
import { toDateKey } from '@/domain/time';
import { isPickupOverdue } from '@/domain/transitions';
import type { Booking } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { selectToday } from '@/state/selectors';
import { formatKrw, formatRemaining, formatTime } from '@/ui/format';
import { REASON_LABEL } from '@/ui/labels';

const QUICK: ReadonlyArray<{ href: string; label: string; icon: IconName; tone: string }> = [
  { href: '/bookings', label: '예약', icon: 'calendar', tone: 'cyan' },
  { href: '/settlement', label: '정산', icon: 'wallet', tone: 'point' },
  { href: '/settings', label: '보관 조건', icon: 'sliders', tone: 'mint' },
  { href: '/support', label: '문의', icon: 'message', tone: 'cyan' },
  { href: '/scan', label: 'QR 확인', icon: 'qr', tone: 'mint' },
];

type FoldId = 'storage' | 'arriving' | 'pending' | 'noshow';

export default function TodayPage() {
  const { state, now } = usePartner();
  const view = selectToday(state.bookings, now, state.policy);
  const [open, setOpen] = useState<FoldId | null>(null);
  const msUntil = (iso: string) => Date.parse(iso) - now.getTime();

  const sections: { id: FoldId; label: string; items: { booking: Booking; hint: string; hintTone: 'warn' | 'muted' }[] }[] = [
    {
      id: 'storage',
      label: '보관 중',
      items: view.inStorage.map((booking) => ({
        booking,
        hint: isPickupOverdue(booking, now) ? '찾으러 올 시간이 지났어요' : `${formatTime(booking.pickUpAt)}에 찾으러 와요`,
        hintTone: isPickupOverdue(booking, now) ? ('warn' as const) : ('muted' as const),
      })),
    },
    {
      id: 'arriving',
      label: '금일 방문 예정',
      items: view.arrivingToday.map((booking) => ({
        booking,
        hint: formatRemaining(msUntil(booking.dropOffAt)).replace('남음', '뒤 도착'),
        hintTone: 'muted' as const,
      })),
    },
    {
      id: 'pending',
      label: '확인 필요',
      items: view.pending.map((booking) => ({
        booking,
        hint: `${booking.approvalReasons.map((reason) => REASON_LABEL[reason]).join(', ')} · ${formatRemaining(msUntil(booking.approvalDeadline ?? booking.createdAt))}`,
        hintTone: 'warn' as const,
      })),
    },
    {
      id: 'noshow',
      label: '노쇼 관리',
      items: view.noShowCandidates.map((booking) => ({
        booking,
        hint: `${formatTime(booking.dropOffAt)} 예약 · 노쇼로 처리할 수 있어요`,
        hintTone: 'warn' as const,
      })),
    },
  ];

  const todayKey = toDateKey(now);
  const todayBookings = state.bookings.filter((booking) => toDateKey(new Date(booking.dropOffAt)) === todayKey);
  const handled = todayBookings.filter((booking) => booking.status === 'completed' || booking.status === 'no_show').length;
  const monthTotal = summarizeSettlement(state.bookings, monthPeriod(now), state.policy).totalKrw;
  const openSection = sections.find((section) => section.id === open) ?? null;

  return (
    <>
      <h1 className="sr-only">오늘</h1>
      <section className="home-strip" aria-label="오늘 요약">
        <div className="home-stat">
          <p className="home-stat-label">오늘 예약</p>
          <p className="home-stat-value">{todayBookings.length}</p>
          <p className="home-stat-sub">{handled}/{todayBookings.length} 처리</p>
        </div>
        <div className="home-stat">
          <p className="home-stat-label">현재 보관</p>
          <p className="home-stat-value">{view.bagsInStorage}</p>
          <p className="home-stat-sub">짐</p>
        </div>
        <div className="home-stat">
          <p className="home-stat-label">이번 달 예상 수익</p>
          <p className="home-stat-value is-money">{formatKrw(monthTotal)}</p>
        </div>
      </section>

      <nav className="quick-grid" aria-label="바로가기">
        {QUICK.map((item) => (
          <Link key={item.href} href={item.href} className="quick-item">
            {item.href === '/bookings' && view.pending.length > 0 ? <span className="qa-pill">확인 필요</span> : null}
            <span className={`qa-icon qa-${item.tone}`}>
              <Icon name={item.icon} size={22} />
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <section className="section">
        <h2 className="section-title">예약 현황 보기</h2>
        <div className="tile-grid">
          {sections.map((section) => {
            const expanded = open === section.id;
            return (
              <button key={section.id} type="button" className={`tile${expanded ? ' is-open' : ''}`} aria-expanded={expanded} onClick={() => setOpen(expanded ? null : section.id)}>
                <span className="tile-count">{section.items.length}</span>
                <span className="tile-label">{section.label}</span>
              </button>
            );
          })}
        </div>
        {openSection ? (
          openSection.items.length === 0 ? (
            <p className="empty">예약이 없어요.</p>
          ) : (
            <div className="stack">
              {openSection.items.map((item) => (
                <BookingCard key={item.booking.id} booking={item.booking} now={now} hint={item.hint} hintTone={item.hintTone} />
              ))}
            </div>
          )
        ) : null}
      </section>
    </>
  );
}
