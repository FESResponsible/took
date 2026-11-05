'use client';

import Link from 'next/link';
import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { useSupplier } from '@/state/SupplierProvider';
import { storeName } from '@/state/selectors';
import { formatWhen } from '@/ui/format';
import { FILTERS, matchesFilter, type BookingFilter } from '@/ui/labels';

export default function BookingsPage() {
  const { state, now } = useSupplier();
  const [filter, setFilter] = useState<BookingFilter>('all');
  const list = state.bookings.filter((booking) => matchesFilter(booking.status, filter)).sort((a, b) => b.dropOffAt.localeCompare(a.dropOffAt));

  return (
    <>
      <header className="page-head">
        <h1>예약</h1>
        <p>이 매장의 예시 예약입니다. 상태를 고르고 코드를 누르면 상세로 갑니다.</p>
      </header>
      <div className="filters" role="tablist" aria-label="예약 상태">
        {FILTERS.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={filter === item.id} className={filter === item.id ? 'is-active' : ''} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <section className="panel">
        {list.length === 0 ? (
          <p className="empty">이 상태의 예약이 없습니다.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>코드</th>
                <th>매장</th>
                <th>손님</th>
                <th>짐</th>
                <th>맡김</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {list.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <Link href={`/bookings/${booking.id}`} className="row-link">
                      {booking.code}
                    </Link>
                  </td>
                  <td>{storeName(state.stores, booking.storeId)}</td>
                  <td>{booking.customerName}</td>
                  <td className="nums">{booking.bags}개</td>
                  <td>{formatWhen(booking.dropOffAt, now)}</td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
