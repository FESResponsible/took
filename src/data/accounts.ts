import type { Store } from '@/domain/types';

/** 로그인 화면에 그대로 보여 주는 예시 계정. 실제 비밀번호가 아니다. */
export interface SampleAccount {
  readonly id: string;
  readonly password: string;
  readonly storeId: string;
  readonly storeName: string;
}

export const SAMPLE_ACCOUNTS: readonly SampleAccount[] = [
  { id: 'hongdae', password: 'demo-hongdae', storeId: 'store-hongdae', storeName: '데모 홍대점' },
  { id: 'myeongdong', password: 'demo-myeongdong', storeId: 'store-myeongdong', storeName: '데모 명동점' },
  { id: 'gangnam', password: 'demo-gangnam', storeId: 'store-gangnam', storeName: '데모 강남점' },
  { id: 'busan', password: 'demo-busan', storeId: 'store-busan', storeName: '데모 부산역점' },
];

export function matchAccount(id: string, password: string): SampleAccount | undefined {
  const trimmed = id.trim();
  return SAMPLE_ACCOUNTS.find((account) => account.id === trimmed && account.password === password);
}

export function storeMatchesAccount(stores: readonly Store[], storeId: string): boolean {
  return stores.some((store) => store.id === storeId);
}
