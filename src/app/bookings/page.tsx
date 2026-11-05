'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookingCard } from '@/components/BookingCard';
import { Icon } from '@/components/icons';
import { usePartner } from '@/state/PartnerProvider';
import { filterBookings, type BookingTab } from '@/state/selectors';

const TABS: ReadonlyArray<{ readonly id: BookingTab; readonly label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'pending', label: '확인 필요' },
  { id: 'upcoming', label: '예정' },
  { id: 'stored', label: '보관 중' },
  { id: 'done', label: '완료' },
  { id: 'other', label: '기타' },
];

export default function BookingsPage() {
  const { state, now } = usePartner();
  const [tab, setTab] = useState<BookingTab>('all');
  const list = filterBookings(state.bookings, tab).reverse();

  return (
    <>
      <Link href="/" className="back-link">
        <Icon name="chevronLeft" size={18} />
        오늘
      </Link>
      <h1 className="page-title">예약</h1>
      <div className="tabs" role="tablist" aria-label="예약 상태">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`tab ${tab === item.id ? 'is-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="empty">해당하는 예약이 없어요.</p>
      ) : (
        <div className="stack">
          {list.map((booking) => (
            <BookingCard key={booking.id} booking={booking} now={now} />
          ))}
        </div>
      )}
    </>
  );
}

