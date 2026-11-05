import { totalBags } from './bags';
import { MINUTE_MS } from './time';
import type { Booking, BookingStatus } from './types';

/** 지금 상태에서는 할 수 없는 일을 요청했을 때. 메시지는 사장님에게 그대로 보여 준다. */
export class BookingTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingTransitionError';
  }
}

function assertStatus(booking: Booking, expected: BookingStatus, action: string): void {
  if (booking.status !== expected) {
    throw new BookingTransitionError(`${booking.code} 예약은 지금 ${action}할 수 없어요.`);
  }
}

export function approve(booking: Booking, now: Date): Booking {
  assertStatus(booking, 'pending_approval', '승인');
  return { ...booking, status: 'confirmed', decidedAt: now.toISOString() };
}

export function reject(booking: Booking, now: Date): Booking {
  assertStatus(booking, 'pending_approval', '거절');
  return { ...booking, status: 'rejected', decidedAt: now.toISOString() };
}

/** 응답 시간이 지난 확인 필요 예약은 만료시킨다. 바뀔 게 없으면 같은 객체를 돌려준다. */
export function expireIfOverdue(booking: Booking, now: Date): Booking {
  if (booking.status !== 'pending_approval' || !booking.approvalDeadline) return booking;
  if (now.getTime() <= Date.parse(booking.approvalDeadline)) return booking;
  return { ...booking, status: 'expired', decidedAt: now.toISOString() };
}

export interface CheckInInput {
  readonly now: Date;
  readonly photos: readonly string[];
  readonly bagTotal: number;
}

export function checkIn(booking: Booking, input: CheckInInput): Booking {
  assertStatus(booking, 'confirmed', '접수');
  if (input.photos.length === 0) {
    throw new BookingTransitionError('짐 사진을 1장 이상 남겨 주세요.');
  }
  if (!Number.isInteger(input.bagTotal) || input.bagTotal <= 0) {
    throw new BookingTransitionError('맡긴 짐 개수를 확인해 주세요.');
  }
  return {
    ...booking,
    status: 'checked_in',
    checkIn: {
      at: input.now.toISOString(),
      photos: [...input.photos],
      bagTotal: input.bagTotal,
      bagCountMismatch: input.bagTotal !== totalBags(booking.bags),
    },
  };
}

export function checkOut(booking: Booking, now: Date): Booking {
  assertStatus(booking, 'checked_in', '반환');
  return { ...booking, status: 'completed', checkedOutAt: now.toISOString() };
}

export function isNoShowCandidate(booking: Booking, now: Date, graceMinutes: number): boolean {
  return booking.status === 'confirmed' && now.getTime() > Date.parse(booking.dropOffAt) + graceMinutes * MINUTE_MS;
}

export function markNoShow(booking: Booking, now: Date, graceMinutes: number): Booking {
  if (!isNoShowCandidate(booking, now, graceMinutes)) {
    throw new BookingTransitionError('아직 노쇼로 처리할 수 없어요. 예약 시간이 지나고 조금 더 기다려 주세요.');
  }
  return { ...booking, status: 'no_show', noShowAt: now.toISOString() };
}

export function isPickupOverdue(booking: Booking, now: Date): boolean {
  return booking.status === 'checked_in' && now.getTime() > Date.parse(booking.pickUpAt);
}

