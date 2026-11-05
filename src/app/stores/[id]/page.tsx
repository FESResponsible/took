'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/StatusBadge';
import { bagsInStorage, isAccepting, todayBookings } from '@/state/selectors';
import { useSupplier } from '@/state/SupplierProvider';
import { formatWhen } from '@/ui/format';

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, now } = useSupplier();
  const store = state.stores.find((item) => item.id === params.id);
  const bookings = state.bookings.filter((booking) => booking.storeId === params.id).sort((a, b) => b.dropOffAt.localeCompare(a.dropOffAt));

  if (!store) {
    return (
      <>
        <Link href="/" className="back-link">
          홈
        </Link>
        <p className="empty">이 매장의 화면이 아닙니다.</p>
      </>
    );
  }

  const accepting = isAccepting(store, now);

  return (
    <>
      <Link href="/" className="back-link">
        홈
      </Link>
      <header className="page-head">
        <p className="card-kicker">{store.area}</p>
        <h1>{store.name}</h1>
        <p>예시 매장 상세입니다.</p>
      </header>
      <section className="detail-grid">
        <article className="detail-card">
          <span>보관 중 짐</span>
          <strong>{bagsInStorage(state.bookings, store.id)}개</strong>
        </article>
        <article className="detail-card">
          <span>오늘 예약 받기</span>
          <strong>{accepting ? '받는 중' : '멈춤'}</strong>
        </article>
        <article className="detail-card">
          <span>오늘 맡기는 예약</span>
          <strong>{todayBookings(state.bookings, now, store.id).length}건</strong>
        </article>
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>이 매장 예약</h2>
        </div>
        {bookings.length === 0 ? (
          <p className="empty">예약이 없습니다.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>코드</th>
                <th>손님</th>
                <th>짐</th>
                <th>맡김</th>
                <th>찾기</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <Link href={`/bookings/${booking.id}`} className="row-link">
                      {booking.code}
                    </Link>
                  </td>
                  <td>{booking.customerName}</td>
                  <td className="nums">{booking.bags}개</td>
                  <td>{formatWhen(booking.dropOffAt, now)}</td>
                  <td>{formatWhen(booking.pickUpAt, now)}</td>
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
