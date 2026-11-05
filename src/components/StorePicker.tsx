'use client';

import { DEMO_STORES } from '@/data/accounts';
import { useSupplier } from '@/state/SupplierProvider';

export function StorePicker() {
  const { selectStore } = useSupplier();

  return (
    <div className="login-screen">
      <section className="login-card">
        <img className="brand-logo" src="/took-logo.png" alt="took" />
        <h1>매장 고르기</h1>
        <p>데모용 매장 전환입니다. 실제 로그인이 아니에요. 비밀번호 없이 매장을 고르면 그 매장의 예약, 정산, 문의만 보여요.</p>
        <div className="store-picker" role="list">
          {DEMO_STORES.map((store) => (
            <button key={store.storeId} type="button" className="btn store-pick" onClick={() => selectStore(store.storeId)}>
              <span>{store.storeName}</span>
              <em>{store.area}</em>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
