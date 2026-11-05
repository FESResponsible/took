'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ApprovalPanel } from '@/components/booking/ApprovalPanel';
import { CheckInPanel } from '@/components/booking/CheckInPanel';
import { CheckOutPanel } from '@/components/booking/CheckOutPanel';
import { ClosedPanel } from '@/components/booking/ClosedPanel';
import { DemoQr } from '@/components/booking/DemoQr';
import { NoShowPanel } from '@/components/booking/NoShowPanel';
import { Icon } from '@/components/icons';
import { StatusBadge } from '@/components/StatusBadge';
import { storageDays } from '@/domain/approval';
import { totalBags } from '@/domain/bags';
import { isNoShowCandidate } from '@/domain/transitions';
import { usePartner } from '@/state/PartnerProvider';
import { unreadCount } from '@/state/selectors';
import { formatBags, formatDateTime } from '@/ui/format';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, now } = usePartner();
  const booking = state.bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <>
        <p className="empty">예약을 찾을 수 없어요.</p>
        <Link href="/bookings" className="btn btn-line">
          예약 목록으로
        </Link>
      </>
    );
  }

  const showNoShow = isNoShowCandidate(booking, now, state.policy.noShowGraceMinutes);
  const threadUnread = unreadCount(state.messages, booking.id);

  return (
    <>
      <Link href="/bookings" className="back-link">
        <Icon name="chevronLeft" size={18} />
        예약
      </Link>
      <div className="detail-head">
        <h1 className="page-title">{booking.code}</h1>
        <StatusBadge status={booking.status} />
      </div>
      <p className="detail-name">
        {booking.customerName} <span className="muted">· {booking.customerLanguage}</span>
      </p>

      <Link href={`/chats/${booking.id}`} className="chat-entry">
        <span className="qa-icon qa-mint">
          <Icon name="message" size={18} />
        </span>
        <span className="chat-entry-label">손님과 대화</span>
        {threadUnread > 0 ? <span className="chat-unread">{threadUnread}</span> : <Icon name="chevron" size={18} />}
      </Link>

      <dl className="info-list">
        <div>
          <dt>짐</dt>
          <dd>
            {formatBags(booking.bags)} (총 {totalBags(booking.bags)}개)
          </dd>
        </div>
        <div>
          <dt>맡기는 시간</dt>
          <dd>{formatDateTime(booking.dropOffAt, now)}</dd>
        </div>
        <div>
          <dt>찾는 시간</dt>
          <dd>{formatDateTime(booking.pickUpAt, now)}</dd>
        </div>
        <div>
          <dt>보관 기간</dt>
          <dd>{storageDays(booking)}일</dd>
        </div>
      </dl>

      {booking.status === 'pending_approval' && <ApprovalPanel booking={booking} />}
      {showNoShow && <NoShowPanel booking={booking} />}
      {booking.status === 'confirmed' && <CheckInPanel key={booking.id} booking={booking} />}
      {booking.status === 'checked_in' && <CheckOutPanel booking={booking} />}
      {['completed', 'no_show', 'rejected', 'expired'].includes(booking.status) && <ClosedPanel booking={booking} />}

      {(booking.status === 'confirmed' || booking.status === 'checked_in') && <DemoQr code={booking.code} />}

      <Link href={`/support?booking=${booking.id}`} className="btn btn-line btn-block">
        이 예약 문의
      </Link>
    </>
  );
}

