import Link from 'next/link';
import type { Booking } from '@/domain/types';
import { formatBags, formatDateTime, formatTime } from '@/ui/format';
import { Icon } from './icons';
import { StatusBadge } from './StatusBadge';

interface BookingCardProps {
  readonly booking: Booking;
  readonly now: Date;
  /** 카드 오른쪽 아래에 보여 줄 한 줄 (예: '23분 남음') */
  readonly hint?: string;
  readonly hintTone?: 'warn' | 'muted';
}

export function BookingCard({ booking, now, hint, hintTone = 'muted' }: BookingCardProps) {
  return (
    <Link href={`/bookings/${booking.id}`} className="booking-card">
      <span className="card-chevron" aria-hidden>
        <Icon name="chevron" size={18} />
      </span>
      <div className="booking-card-top">
        <span className="booking-code">{booking.code}</span>
        <StatusBadge status={booking.status} />
      </div>
      <p className="booking-name">
        {booking.customerName} <span className="muted">· {booking.customerLanguage}</span>
      </p>
      <p className="booking-meta">
        짐 {formatBags(booking.bags)} · {formatDateTime(booking.dropOffAt, now)} → {formatTime(booking.pickUpAt)}
      </p>
      {hint && <p className={`booking-hint hint-${hintTone}`}>{hint}</p>}
    </Link>
  );
}

