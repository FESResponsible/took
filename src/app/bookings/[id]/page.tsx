'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/StatusBadge';
import { useSupplier } from '@/state/SupplierProvider';
import { storeName } from '@/state/selectors';
import { formatWhen } from '@/ui/format';

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, now } = useSupplier();
  const booking = state.bookings.find((item) => item.id === params.id);

  if (!booking) {
    return (
      <>
        <Link href="/bookings" className="back-link">
          예약 목록
        </Link>
        <p className="empty">없는 예약입니다.</p>
      </>
    );
  }

  return (
    <>
      <Link href="/bookings" className="back-link">
        예약 목록
      </Link>
      <header className="page-head">
        <p className="card-kicker">{booking.code}</p>
        <h1>{booking.customerName}</h1>
        <p>예시 예약입니다. 손님에게 안내하지 않아요.</p>
      </header>
      <section className="panel detail-list">
        <div>
          <span>상태</span>
          <StatusBadge status={booking.status} />
        </div>
        <div>
          <span>매장</span>
          <Link href={`/stores/${booking.storeId}`} className="row-link">
            {storeName(state.stores, booking.storeId)}
          </Link>
        </div>
        <div>
          <span>짐</span>
          <strong>{booking.bags}개</strong>
        </div>
        <div>
          <span>맡김</span>
          <strong>{formatWhen(booking.dropOffAt, now)}</strong>
        </div>
        <div>
          <span>찾기</span>
          <strong>{formatWhen(booking.pickUpAt, now)}</strong>
        </div>
      </section>
    </>
  );
}
