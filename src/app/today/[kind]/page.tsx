'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookingCard } from '@/components/BookingCard';
import { Icon } from '@/components/icons';
import { usePartner } from '@/state/PartnerProvider';
import { todayLists, type TodayListId } from '../lists';

const IDS: readonly TodayListId[] = ['stored', 'arriving', 'pending', 'no-show'];

export default function TodayListPage() {
  const params = useParams<{ kind: string }>();
  const { state, now } = usePartner();
  const kind = params.kind;
  const list = IDS.includes(kind as TodayListId) ? todayLists(state.bookings, now, state.policy).find((item) => item.id === kind) : undefined;

  return (
    <>
      <Link href="/" className="back-link">
        <Icon name="chevronLeft" size={18} />
        오늘
      </Link>
      {list ? (
        <>
          <h1 className="page-title">{list.label}</h1>
          {list.items.length === 0 ? (
            <p className="empty">예약이 없어요.</p>
          ) : (
            <div className="stack">
              {list.items.map((item) => (
                <BookingCard key={item.booking.id} booking={item.booking} now={now} hint={item.hint} hintTone={item.hintTone} />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="empty">없는 화면이에요.</p>
      )}
    </>
  );
}
