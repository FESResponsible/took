import type { Booking, Store } from '@/domain/types';
import { toDateKey } from '@/ui/format';

export function isAccepting(store: Store, now: Date): boolean {
  return store.pausedOn !== toDateKey(now);
}

export function bagsInStorage(bookings: readonly Booking[], storeId?: string): number {
  return bookings.filter((booking) => booking.status === 'checked_in' && (storeId === undefined || booking.storeId === storeId)).reduce((sum, booking) => sum + booking.bags, 0);
}

export function todayBookings(bookings: readonly Booking[], now: Date, storeId?: string): Booking[] {
  const today = toDateKey(now);
  return bookings.filter((booking) => (storeId === undefined || booking.storeId === storeId) && toDateKey(new Date(booking.dropOffAt)) === today);
}

export function storeName(stores: readonly Store[], storeId: string): string {
  return stores.find((store) => store.id === storeId)?.name ?? '알 수 없는 매장';
}
