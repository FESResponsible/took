'use client';

import Link from 'next/link';
import { monthTotalKrw, NO_SHOW_RATE, PAYOUT_PER_BAG_KRW, payoutByStore } from '@/domain/settlement';
import { useSupplier } from '@/state/SupplierProvider';
import { formatKrw } from '@/ui/format';

export default function SettlementPage() {
  const { state, now } = useSupplier();
  const payouts = payoutByStore(state.bookings, now);
  const total = monthTotalKrw(state.bookings, now);

  return (
    <>
      <header className="page-head">
        <h1>정산</h1>
        <p>
          {now.getMonth() + 1}월 예상 지급입니다. 짐 1개 {formatKrw(PAYOUT_PER_BAG_KRW)}, 노쇼는 {Math.round(NO_SHOW_RATE * 100)}%입니다. 금액은 이 기기에만 계산되는 예시이며 입금되지 않습니다.
        </p>
      </header>
      <section className="hero">
        <span>이번 달 예상 지급 합계</span>
        <strong>{formatKrw(total)}</strong>
        <em>이 기기에만 보여 주는 예시 금액입니다.</em>
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>내 매장 예시 금액</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>매장</th>
              <th>보관 완료</th>
              <th>노쇼</th>
              <th>짐</th>
              <th>예상 지급</th>
            </tr>
          </thead>
          <tbody>
            {state.stores.map((store) => {
              const row = payouts.find((item) => item.storeId === store.id);
              return (
                <tr key={store.id}>
                  <td>
                    <Link href={`/stores/${store.id}`} className="row-link">
                      {store.name}
                    </Link>
                  </td>
                  <td className="nums">{row?.storageCount ?? 0}건</td>
                  <td className="nums">{row?.noShowCount ?? 0}건</td>
                  <td className="nums">{row?.bags ?? 0}개</td>
                  <td className="nums">{formatKrw(row?.amountKrw ?? 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}
