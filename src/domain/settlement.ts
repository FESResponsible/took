import type { Booking } from './types';

/** 파트너 앱과 같은 예시 단가. 실제 정산 금액이 아니다. */
export const PAYOUT_PER_BAG_KRW = 2500;
export const NO_SHOW_RATE = 0.5;

export interface SettlementLine {
  readonly bookingId: string;
  readonly storeId: string;
  readonly kind: 'storage' | 'no_show';
  readonly bags: number;
  readonly amountKrw: number;
}

export interface StorePayout {
  readonly storeId: string;
  readonly storageCount: number;
  readonly noShowCount: number;
  readonly bags: number;
  readonly amountKrw: number;
}

function inMonth(iso: string, now: Date): boolean {
  const time = Date.parse(iso);
  const from = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
  return time >= from && time < to;
}

export function monthLines(bookings: readonly Booking[], now: Date): SettlementLine[] {
  const lines: SettlementLine[] = [];
  for (const booking of bookings) {
    if (booking.status === 'completed' && booking.checkedOutAt && inMonth(booking.checkedOutAt, now)) {
      lines.push({
        bookingId: booking.id,
        storeId: booking.storeId,
        kind: 'storage',
        bags: booking.bags,
        amountKrw: booking.bags * PAYOUT_PER_BAG_KRW,
      });
    }
    if (booking.status === 'no_show' && booking.noShowAt && inMonth(booking.noShowAt, now)) {
      lines.push({
        bookingId: booking.id,
        storeId: booking.storeId,
        kind: 'no_show',
        bags: booking.bags,
        amountKrw: Math.round(booking.bags * PAYOUT_PER_BAG_KRW * NO_SHOW_RATE),
      });
    }
  }
  return lines;
}

export function payoutByStore(bookings: readonly Booking[], now: Date): StorePayout[] {
  const map = new Map<string, StorePayout>();
  for (const line of monthLines(bookings, now)) {
    const current = map.get(line.storeId) ?? { storeId: line.storeId, storageCount: 0, noShowCount: 0, bags: 0, amountKrw: 0 };
    map.set(line.storeId, {
      storeId: line.storeId,
      storageCount: current.storageCount + (line.kind === 'storage' ? 1 : 0),
      noShowCount: current.noShowCount + (line.kind === 'no_show' ? 1 : 0),
      bags: current.bags + line.bags,
      amountKrw: current.amountKrw + line.amountKrw,
    });
  }
  return [...map.values()];
}

export function monthTotalKrw(bookings: readonly Booking[], now: Date): number {
  return monthLines(bookings, now).reduce((sum, line) => sum + line.amountKrw, 0);
}
