import type { ApprovalDecision, BookingRequest } from './approval';
import { addMinutes } from './time';
import type { Booking, Policy } from './types';

export interface NewBookingInput {
  readonly id: string;
  readonly code: string;
  readonly customerName: string;
  readonly customerLanguage: string;
  readonly request: BookingRequest;
}

type AcceptedDecision = Exclude<ApprovalDecision, { kind: 'unavailable' }>;

export function createBooking(input: NewBookingInput, decision: AcceptedDecision, now: Date, policy: Policy): Booking {
  const createdAt = now.toISOString();
  const base = {
    id: input.id,
    code: input.code,
    customerName: input.customerName,
    customerLanguage: input.customerLanguage,
    bags: input.request.bags,
    dropOffAt: input.request.dropOffAt,
    pickUpAt: input.request.pickUpAt,
    createdAt,
  };
  if (decision.kind === 'auto_confirm') {
    return { ...base, status: 'confirmed', approvalReasons: [], decidedAt: createdAt };
  }
  return {
    ...base,
    status: 'pending_approval',
    approvalReasons: decision.reasons,
    approvalDeadline: addMinutes(createdAt, policy.approvalResponseMinutes),
  };
}

