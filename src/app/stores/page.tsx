'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSupplier } from '@/state/SupplierProvider';

export default function StoresPage() {
  const { state } = useSupplier();
  const router = useRouter();
  const store = state.stores[0];

  useEffect(() => {
    if (store) router.replace(`/stores/${store.id}`);
  }, [router, store]);

  return <p className="loading">내 매장으로 이동해요.</p>;
}
