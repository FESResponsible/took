import type { Store } from '@/domain/types';

/** 데모에서 골라 볼 수 있는 매장. 계정 정보는 없다. */
export interface DemoStoreOption {
  readonly storeId: string;
  readonly storeName: string;
  readonly area: string;
}

export const DEMO_STORES: readonly DemoStoreOption[] = [
  { storeId: 'store-hongdae', storeName: '데모 홍대점', area: '서울 마포' },
  { storeId: 'store-myeongdong', storeName: '데모 명동점', area: '서울 중구' },
  { storeId: 'store-gangnam', storeName: '데모 강남점', area: '서울 강남' },
  { storeId: 'store-busan', storeName: '데모 부산역점', area: '부산 동구' },
];

export function isDemoStore(storeId: string): boolean {
  return DEMO_STORES.some((store) => store.storeId === storeId);
}

export function storeExists(stores: readonly Store[], storeId: string): boolean {
  return stores.some((store) => store.id === storeId);
}
