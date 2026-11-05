'use client';

import Link from 'next/link';
import { useState } from 'react';
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
      label: '오늘 맡기러 와요',
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
      label: '노쇼',
      items: view.noShowCandidates.map((booking) => ({
        booking,
        hint: `${formatTime(booking.dropOffAt)} 예약 · 노쇼로 처리할 수 있어요`,
        hintTone: 'warn' as const,
      })),
    },
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

      <div className="fold-list">
        {sections.map((section) => {
          const expanded = open === section.id;
          return (
            <section key={section.id} className={`fold${expanded ? ' is-open' : ''}`}>
              <button type="button" className="fold-row" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : section.id)}>
                <span className="fold-label">{section.label}</span>
                <span className="section-count">{section.items.length}</span>
                <span className="fold-chevron" aria-hidden="true">
                  <Icon name="chevron" size={18} />
                </span>
              </button>
              {expanded ? (
                section.items.length === 0 ? (
                  <p className="empty">예약이 없어요.</p>
                ) : (
                  <div className="stack">
                    {section.items.map((item) => (
                      <BookingCard key={item.booking.id} booking={item.booking} now={now} hint={item.hint} hintTone={item.hintTone} />
                    ))}
                  </div>
                )
              ) : null}
            </section>
          );
        })}
      </div>
    </>
  );
}
