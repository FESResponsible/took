'use client';

import Link from 'next/link';
import { BookingCard } from '@/components/BookingCard';
import { Icon, type IconName } from '@/components/icons';
import { isPickupOverdue } from '@/domain/transitions';
import type { Booking } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { selectToday } from '@/state/selectors';
import { formatRemaining, formatTime } from '@/ui/format';
import { REASON_LABEL } from '@/ui/labels';

const QUICK: ReadonlyArray<{ href: string; label: string; icon: IconName; tone: string }> = [
  { href: '/bookings', label: '예약', icon: 'calendar', tone: 'cyan' },
  { href: '/settlement', label: '정산', icon: 'wallet', tone: 'point' },
  { href: '/settings', label: '보관 조건', icon: 'sliders', tone: 'mint' },
  { href: '/support', label: '문의', icon: 'message', tone: 'cyan' },
  { href: '/scan', label: 'QR 확인', icon: 'qr', tone: 'mint' },
];

export default function TodayPage() {
  const { state, now } = usePartner();
  const view = selectToday(state.bookings, now, state.policy);
  const msUntil = (iso: string) => Date.parse(iso) - now.getTime();

  const cards: { booking: Booking; hint: string; hintTone: 'warn' | 'muted' }[] = [
    ...view.arrivingToday.map((booking) => ({
      booking,
      hint: formatRemaining(msUntil(booking.dropOffAt)).replace('남음', '뒤 도착'),
      hintTone: 'muted' as const,
    })),
    ...view.inStorage.map((booking) => ({
      booking,
      hint: isPickupOverdue(booking, now) ? '찾으러 올 시간이 지났어요' : `${formatTime(booking.pickUpAt)}에 찾으러 와요`,
      hintTone: isPickupOverdue(booking, now) ? ('warn' as const) : ('muted' as const),
    })),
    ...view.pending.map((booking) => ({
      booking,
      hint: `${booking.approvalReasons.map((reason) => REASON_LABEL[reason]).join(', ')} · ${formatRemaining(msUntil(booking.approvalDeadline ?? booking.createdAt))}`,
      hintTone: 'warn' as const,
    })),
    ...view.noShowCandidates.map((booking) => ({
      booking,
      hint: `${formatTime(booking.dropOffAt)} 예약 · 노쇼로 처리할 수 있어요`,
      hintTone: 'warn' as const,
    })),
  ];

  return (
    <>
      <h1 className="sr-only">오늘</h1>
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
        <h2 className="section-title">
          당일 예약 현황
          <span className="section-count">{cards.length}</span>
        </h2>
        {cards.length === 0 ? (
          <p className="empty">오늘 예약이 없어요.</p>
        ) : (
          <div className="stack">
            {cards.map((item) => (
              <BookingCard key={item.booking.id} booking={item.booking} now={now} hint={item.hint} hintTone={item.hintTone} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
