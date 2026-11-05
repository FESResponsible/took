import type { Booking, Inquiry, Store, SupplierState } from '@/domain/types';
import { toDateKey } from '@/ui/format';

function at(now: Date, day: number, hour: number, minute = 0): string {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, hour, minute).toISOString();
}

export function createSeed(now: Date): SupplierState {
  const today = toDateKey(now);
  const stores: Store[] = [
    { id: 'store-hongdae', name: '데모 홍대점', area: '서울 마포' },
    { id: 'store-myeongdong', name: '데모 명동점', area: '서울 중구' },
    { id: 'store-gangnam', name: '데모 강남점', area: '서울 강남', pausedOn: today },
    { id: 'store-busan', name: '데모 부산역점', area: '부산 동구' },
  ];

  const bookings: Booking[] = [
    { id: 'b1', code: 'TK-2041', storeId: 'store-hongdae', customerName: 'Emma Wilson', bags: 2, dropOffAt: at(now, 0, 9), pickUpAt: at(now, 0, 18), status: 'checked_in' },
    { id: 'b2', code: 'TK-5521', storeId: 'store-hongdae', customerName: 'Sato Yui', bags: 1, dropOffAt: at(now, 0, 15), pickUpAt: at(now, 0, 20), status: 'confirmed' },
    { id: 'b3', code: 'TK-1024', storeId: 'store-hongdae', customerName: 'Sophie Brown', bags: 2, dropOffAt: at(now, -1, 11), pickUpAt: at(now, -1, 17), status: 'completed', checkedOutAt: at(now, -1, 17) },
    { id: 'b4', code: 'TK-1189', storeId: 'store-myeongdong', customerName: 'Olivia Chen', bags: 3, dropOffAt: at(now, 0, 10), pickUpAt: at(now, 0, 19), status: 'checked_in' },
    { id: 'b5', code: 'TK-3187', storeId: 'store-myeongdong', customerName: 'Wang Wei', bags: 6, dropOffAt: at(now, 0, 16), pickUpAt: at(now, 0, 21), status: 'pending_approval' },
    { id: 'b6', code: 'TK-1031', storeId: 'store-myeongdong', customerName: 'Tanaka Ren', bags: 1, dropOffAt: at(now, -2, 12), pickUpAt: at(now, -2, 16), status: 'completed', checkedOutAt: at(now, -2, 16) },
    { id: 'b7', code: 'TK-1072', storeId: 'store-gangnam', customerName: 'Mateo Garcia', bags: 2, dropOffAt: at(now, -3, 10), pickUpAt: at(now, -3, 16), status: 'no_show', noShowAt: at(now, -3, 11) },
    { id: 'b8', code: 'TK-6402', storeId: 'store-gangnam', customerName: 'Nguyen An', bags: 1, dropOffAt: at(now, 1, 11), pickUpAt: at(now, 1, 17), status: 'confirmed' },
    { id: 'b9', code: 'TK-1047', storeId: 'store-gangnam', customerName: 'Li Na', bags: 2, dropOffAt: at(now, -1, 10), pickUpAt: at(now, -1, 15), status: 'completed', checkedOutAt: at(now, -1, 15) },
    { id: 'b10', code: 'TK-4410', storeId: 'store-busan', customerName: '박지훈', bags: 1, dropOffAt: at(now, 0, 9, 30), pickUpAt: at(now, 0, 13), status: 'checked_in' },
    { id: 'b11', code: 'TK-7730', storeId: 'store-busan', customerName: 'Lucas Martin', bags: 2, dropOffAt: at(now, 0, 14), pickUpAt: at(now, 0, 18), status: 'confirmed' },
    { id: 'b12', code: 'TK-1058', storeId: 'store-busan', customerName: 'Daniel Kim', bags: 1, dropOffAt: at(now, -2, 11), pickUpAt: at(now, -2, 18), status: 'completed', checkedOutAt: at(now, -2, 18) },
  ];

  const inquiries: Inquiry[] = [
    { id: 'q1', storeId: 'store-hongdae', title: '예시 정산 금액 확인', body: '어제 완료한 예약의 예시 금액이 맞는지 적어 두었습니다. 매장에 보낸 문의가 아닙니다.', createdAt: at(now, 0, 9, 20) },
    { id: 'q2', storeId: 'store-gangnam', title: '오늘 예약 멈춤', body: '강남점은 오늘 새 예약을 받지 않는 예시입니다. 실제로 매장에 전달되지 않습니다.', createdAt: at(now, 0, 8, 40) },
    { id: 'q3', storeId: 'store-myeongdong', title: '노쇼 예시 비율', body: '노쇼 보상은 짐당 단가의 50%로 계산하는 예시입니다.', createdAt: at(now, -1, 18, 10) },
  ];

  return { version: 1, stores, bookings, inquiries, notes: [] };
}
