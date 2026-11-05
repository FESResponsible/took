import { BAG_SIZES, totalBags } from './bags';
import { peakBagLoad } from './capacity';
import { DAY_MS, isWithinOpenHours, toDateKey } from './time';
import type { ApprovalReason, BagCount, Booking, StoreSettings } from './types';

export interface BookingRequest {
  readonly bags: BagCount;
  readonly dropOffAt: string;
  readonly pickUpAt: string;
}

export type ApprovalDecision =
  | { readonly kind: 'auto_confirm' }
  | { readonly kind: 'needs_approval'; readonly reasons: readonly ApprovalReason[] }
  | { readonly kind: 'unavailable'; readonly reason: 'paused' | 'invalid_request' };

export function storageDays(request: Pick<BookingRequest, 'dropOffAt' | 'pickUpAt'>): number {
  return Math.ceil((Date.parse(request.pickUpAt) - Date.parse(request.dropOffAt)) / DAY_MS);
}

function collectReasons(
  request: BookingRequest,
  settings: StoreSettings,
  existing: readonly Booking[],
): ApprovalReason[] {
  const bagTotal = totalBags(request.bags);
  const checks: ReadonlyArray<readonly [ApprovalReason, boolean]> = [
    ['size_not_accepted', BAG_SIZES.some((size) => request.bags[size] > 0 && !settings.acceptedSizes[size])],
    [
      'outside_hours',
      !isWithinOpenHours(new Date(request.dropOffAt), settings.openHours) ||
        !isWithinOpenHours(new Date(request.pickUpAt), settings.openHours),
    ],
    ['long_stay', storageDays(request) > settings.maxStorageDays],
    ['group', bagTotal >= settings.groupBagThreshold],
    ['over_capacity', peakBagLoad(existing, request.dropOffAt, request.pickUpAt) + bagTotal > settings.maxBagsAtOnce],
  ];
  return checks.filter(([, hit]) => hit).map(([reason]) => reason);
}

/**
 * 매장이 정한 조건 안이면 자동 확정, 벗어나면 사장님 확인이 필요하다.
 * 예약을 멈춘 날이거나 요청이 잘못되면 받을 수 없다.
 */
export function evaluateBooking(
  request: BookingRequest,
  settings: StoreSettings,
  existing: readonly Booking[],
): ApprovalDecision {
  const isValid = Date.parse(request.pickUpAt) > Date.parse(request.dropOffAt) && totalBags(request.bags) > 0;
  if (!isValid) return { kind: 'unavailable', reason: 'invalid_request' };
  if (settings.pausedOn === toDateKey(new Date(request.dropOffAt))) return { kind: 'unavailable', reason: 'paused' };

  const reasons = collectReasons(request, settings, existing);
  return reasons.length === 0 ? { kind: 'auto_confirm' } : { kind: 'needs_approval', reasons };
}

