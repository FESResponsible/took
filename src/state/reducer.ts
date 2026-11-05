import { evaluateBooking } from '@/domain/approval';
import { createBooking, type NewBookingInput } from '@/domain/bookingFactory';
import { validateSettings } from '@/domain/settings';
import {
  BookingTransitionError,
  approve,
  checkIn,
  checkOut,
  expireIfOverdue,
  markNoShow,
  reject,
  type CheckInInput,
} from '@/domain/transitions';
import type { Booking, ChatMessage, Policy, StoreProfile, StoreSettings, Ticket } from '@/domain/types';

export interface Notice {
  readonly kind: 'success' | 'error';
  readonly message: string;
}

export interface PartnerState {
  readonly version: 1;
  readonly store: StoreProfile;
  readonly settings: StoreSettings;
  readonly policy: Policy;
  readonly bookings: readonly Booking[];
  readonly tickets: readonly Ticket[];
  readonly messages: readonly ChatMessage[];
  readonly notice: Notice | null;
}

export type PartnerAction =
  | { readonly type: 'approve'; readonly id: string; readonly now: Date }
  | { readonly type: 'reject'; readonly id: string; readonly now: Date }
  | { readonly type: 'check_in'; readonly id: string; readonly input: CheckInInput }
  | { readonly type: 'check_out'; readonly id: string; readonly now: Date }
  | { readonly type: 'mark_no_show'; readonly id: string; readonly now: Date }
  | { readonly type: 'tick'; readonly now: Date }
  | { readonly type: 'simulate_booking'; readonly input: NewBookingInput; readonly now: Date }
  | { readonly type: 'update_settings'; readonly settings: StoreSettings }
  | { readonly type: 'toggle_pause'; readonly dateKey: string }
  | { readonly type: 'add_ticket'; readonly ticket: Ticket }
  | { readonly type: 'send_message'; readonly id: string; readonly bookingId: string; readonly body: string; readonly photos?: readonly string[]; readonly now: Date }
  | { readonly type: 'mark_thread_read'; readonly bookingId: string; readonly now: Date }
  | { readonly type: 'mark_guest_read'; readonly id: string; readonly now: Date }
  | { readonly type: 'dismiss_notice' }
  | { readonly type: 'reset'; readonly state: PartnerState };

const withNotice = (state: PartnerState, kind: Notice['kind'], message: string): PartnerState => ({
  ...state,
  notice: { kind, message },
});

function applyTransition(
  state: PartnerState,
  id: string,
  transition: (booking: Booking) => Booking,
  successMessage: string,
): PartnerState {
  const target = state.bookings.find((booking) => booking.id === id);
  if (!target) return withNotice(state, 'error', '예약을 찾을 수 없어요.');
  try {
    const updated = transition(target);
    const bookings = state.bookings.map((booking) => (booking.id === id ? updated : booking));
    return withNotice({ ...state, bookings }, 'success', successMessage);
  } catch (error) {
    if (error instanceof BookingTransitionError) return withNotice(state, 'error', error.message);
    throw error;
  }
}

function tick(state: PartnerState, now: Date): PartnerState {
  const bookings = state.bookings.map((booking) => expireIfOverdue(booking, now));
  const changed = bookings.some((booking, index) => booking !== state.bookings[index]);
  return changed ? { ...state, bookings } : state;
}

function simulateBooking(state: PartnerState, input: NewBookingInput, now: Date): PartnerState {
  const decision = evaluateBooking(input.request, state.settings, state.bookings);
  if (decision.kind === 'unavailable') {
    const message = decision.reason === 'paused' ? '그날은 예약을 멈춰 두셨어요.' : '예약 정보가 올바르지 않아요.';
    return withNotice(state, 'error', message);
  }
  const booking = createBooking(input, decision, now, state.policy);
  const message =
    decision.kind === 'auto_confirm' ? '새 예약이 조건에 맞아 자동으로 확정됐어요.' : '확인이 필요한 예약이 들어왔어요.';
  return withNotice({ ...state, bookings: [...state.bookings, booking] }, 'success', message);
}

function updateSettings(state: PartnerState, settings: StoreSettings): PartnerState {
  const problems = validateSettings(settings);
  if (problems.length > 0) return withNotice(state, 'error', problems[0]);
  return withNotice({ ...state, settings }, 'success', '보관 조건을 저장했어요.');
}

function sendMessage(state: PartnerState, action: Extract<PartnerAction, { type: 'send_message' }>): PartnerState {
  const body = action.body.trim();
  const photos = (action.photos ?? []).filter((photo) => photo.startsWith('data:image/'));
  if (!body && photos.length === 0) return state;
  if (!state.bookings.some((booking) => booking.id === action.bookingId)) {
    return withNotice(state, 'error', '예약을 찾을 수 없어요.');
  }
  const message: ChatMessage = {
    id: action.id,
    bookingId: action.bookingId,
    author: 'store',
    body,
    createdAt: action.now.toISOString(),
    photos: photos.length > 0 ? photos : undefined,
  };
  return { ...state, messages: [...state.messages, message] };
}

function markGuestRead(state: PartnerState, id: string, now: Date): PartnerState {
  let changed = false;
  const messages = state.messages.map((message) => {
    if (message.id !== id || message.author !== 'store' || message.guestReadAt) return message;
    changed = true;
    return { ...message, guestReadAt: now.toISOString() };
  });
  return changed ? { ...state, messages } : state;
}

function markThreadRead(state: PartnerState, bookingId: string, now: Date): PartnerState {
  const readAt = now.toISOString();
  let changed = false;
  const messages = state.messages.map((message) => {
    if (message.bookingId !== bookingId || message.author !== 'guest' || message.readAt) return message;
    changed = true;
    return { ...message, readAt };
  });
  return changed ? { ...state, messages } : state;
}

function togglePause(state: PartnerState, dateKey: string): PartnerState {
  const isPaused = state.settings.pausedOn === dateKey;
  const settings = { ...state.settings, pausedOn: isPaused ? undefined : dateKey };
  const message = isPaused ? '오늘 예약을 다시 받아요.' : '오늘은 새 예약을 받지 않아요.';
  return withNotice({ ...state, settings }, 'success', message);
}

export function partnerReducer(state: PartnerState, action: PartnerAction): PartnerState {
  const grace = state.policy.noShowGraceMinutes;
  switch (action.type) {
    case 'approve':
      return applyTransition(state, action.id, (b) => approve(b, action.now), '예약을 승인했어요.');
    case 'reject':
      return applyTransition(state, action.id, (b) => reject(b, action.now), '예약을 거절했어요. 이 기기에만 남고 고객에게는 안내하지 않아요.');
    case 'check_in':
      return applyTransition(state, action.id, (b) => checkIn(b, action.input), '짐을 접수했어요.');
    case 'check_out':
      return applyTransition(state, action.id, (b) => checkOut(b, action.now), '짐을 돌려드렸어요. 정산에 반영돼요.');
    case 'mark_no_show':
      return applyTransition(state, action.id, (b) => markNoShow(b, action.now, grace), '노쇼로 처리했어요. 보상이 정산에 반영돼요.');
    case 'tick':
      return tick(state, action.now);
    case 'simulate_booking':
      return simulateBooking(state, action.input, action.now);
    case 'update_settings':
      return updateSettings(state, action.settings);
    case 'toggle_pause':
      return togglePause(state, action.dateKey);
    case 'add_ticket':
      return withNotice(
        { ...state, tickets: [action.ticket, ...state.tickets] },
        'success',
        '이 기기에만 저장했어요. 담당자에게 전달되지 않아요.',
      );
    case 'send_message':
      return sendMessage(state, action);
    case 'mark_thread_read':
      return markThreadRead(state, action.bookingId, action.now);
    case 'mark_guest_read':
      return markGuestRead(state, action.id, action.now);
    case 'dismiss_notice':
      return { ...state, notice: null };
    case 'reset':
      return action.state;
  }
}

