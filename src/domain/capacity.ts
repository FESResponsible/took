import { totalBags } from './bags';
import { intervalsOverlap } from './time';
import type { Booking, BookingStatus } from './types';

/** 보관 공간을 차지하거나 차지할 예정인 상태 */
export const ACTIVE_STATUSES: readonly BookingStatus[] = ['pending_approval', 'confirmed', 'checked_in'];

export function isActive(booking: Booking): boolean {
  return ACTIVE_STATUSES.includes(booking.status);
}

const toMs = (iso: string): number => Date.parse(iso);

function loadAt(bookings: readonly Booking[], moment: number): number {
  return bookings
    .filter((b) => toMs(b.dropOffAt) <= moment && moment < toMs(b.pickUpAt))
    .reduce((sum, b) => sum + totalBags(b.bags), 0);
}

/** [start, end) 구간에서 동시에 보관 중인 짐이 가장 많은 순간의 개수 */
export function peakBagLoad(bookings: readonly Booking[], startIso: string, endIso: string): number {
  const start = toMs(startIso);
  const end = toMs(endIso);
  const relevant = bookings.filter(
    (b) => isActive(b) && intervalsOverlap(toMs(b.dropOffAt), toMs(b.pickUpAt), start, end),
  );
  const moments = [start, ...relevant.map((b) => toMs(b.dropOffAt)).filter((t) => t > start && t < end)];
  return Math.max(0, ...moments.map((moment) => loadAt(relevant, moment)));
}

