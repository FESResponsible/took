'use client';

import Link from 'next/link';
import { monthTotalKrw } from '@/domain/settlement';
import { bagsInStorage, isAccepting, todayBookings } from '@/state/selectors';
import { useSupplier } from '@/state/SupplierProvider';
import { formatKrw } from '@/ui/format';

export default function HomePage() {
  const { state, now } = useSupplier();
  const today = todayBookings(state.bookings, now);
  const openInquiries = state.inquiries.filter((inquiry) => !state.notes.some((note) => note.inquiryId === inquiry.id));
  const payout = monthTotalKrw(state.bookings, now);

  return (
    <>
      <header className="page-head">
        <h1>홈</h1>
        <p>{state.stores[0]?.name ?? '내 매장'}의 예시 현황입니다. 금액은 이 기기에만 보여요.</p>
      </header>
      <section className="stat-grid" aria-label="현황">
        <Link href={state.stores[0] ? `/stores/${state.stores[0].id}` : '/'} className="stat-card">
          <span>매장</span>
          <strong>{state.stores.length}</strong>
          <em>{state.stores[0]?.area ?? '내 매장'}</em>
        </Link>
        <Link href="/bookings" className="stat-card">
          <span>오늘 예약</span>
          <strong>{today.length}</strong>
          <em>맡기는 날이 오늘</em>
        </Link>
        <Link href="/settlement" className="stat-card">
          <span>이번 달 예상 지급</span>
          <strong className="is-money">{formatKrw(payout)}</strong>
          <em>예시 금액</em>
        </Link>
        <Link href="/inquiries" className="stat-card">
          <span>열린 문의</span>
          <strong>{openInquiries.length}</strong>
          <em>메모가 없는 예시</em>
        </Link>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>내 매장</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>매장</th>
              <th>지역</th>
              <th>보관 중 짐</th>
              <th>오늘</th>
            </tr>
          </thead>
          <tbody>
            {state.stores.map((store) => (
              <tr key={store.id}>
                <td>
                  <Link href={`/stores/${store.id}`} className="row-link">
                    {store.name}
                  </Link>
                </td>
                <td>{store.area}</td>
                <td className="nums">{bagsInStorage(state.bookings, store.id)}개</td>
                <td>
                  <span className={isAccepting(store, now) ? 'pill pill-on' : 'pill pill-off'}>{isAccepting(store, now) ? '받는 중' : '멈춤'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
