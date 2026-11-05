import { totalBags } from '@/domain/bags';
import { toDateKey } from '@/domain/time';
import { isNoShowCandidate } from '@/domain/transitions';
import type { Booking, BookingStatus, ChatMessage, Policy } from '@/domain/types';

export interface TodayView {
  readonly pending: readonly Booking[];
  readonly noShowCandidates: readonly Booking[];
  readonly arrivingToday: readonly Booking[];
  readonly inStorage: readonly Booking[];
  readonly bagsInStorage: number;
}

const byTime = (key: 'dropOffAt' | 'pickUpAt') => (a: Booking, b: Booking): number => a[key].localeCompare(b[key]);

export function storedBagCount(booking: Booking): number {
  return booking.checkIn?.bagTotal ?? totalBags(booking.bags);
}

export function selectToday(bookings: readonly Booking[], now: Date, policy: Policy): TodayView {
  const today = toDateKey(now);
  const noShowCandidates = bookings.filter((b) => isNoShowCandidate(b, now, policy.noShowGraceMinutes));
  const inStorage = bookings.filter((b) => b.status === 'checked_in').sort(byTime('pickUpAt'));
  return {
    pending: bookings
      .filter((b) => b.status === 'pending_approval')
      .sort((a, b) => (a.approvalDeadline ?? '').localeCompare(b.approvalDeadline ?? '')),
    noShowCandidates: [...noShowCandidates].sort(byTime('dropOffAt')),
    arrivingToday: bookings
      .filter((b) => b.status === 'confirmed' && toDateKey(new Date(b.dropOffAt)) === today)
      .filter((b) => !noShowCandidates.includes(b))
      .sort(byTime('dropOffAt')),
    inStorage,
    bagsInStorage: inStorage.reduce((sum, b) => sum + storedBagCount(b), 0),
  };
}

export type BookingTab = 'all' | 'pending' | 'upcoming' | 'stored' | 'done' | 'other';

const TAB_STATUSES: Readonly<Record<Exclude<BookingTab, 'all'>, readonly BookingStatus[]>> = {
  pending: ['pending_approval'],
  upcoming: ['confirmed'],
  stored: ['checked_in'],
  done: ['completed'],
  other: ['rejected', 'expired', 'no_show'],
};

export function filterBookings(bookings: readonly Booking[], tab: BookingTab): Booking[] {
  const matches = tab === 'all' ? [...bookings] : bookings.filter((b) => TAB_STATUSES[tab].includes(b.status));
  return matches.sort(byTime('dropOffAt'));
}

export function messagePreview(message: ChatMessage): string {
  if (message.body.trim()) return message.body;
  const count = message.photos?.length ?? 0;
  if (count === 0) return '';
  return count === 1 ? '사진' : `사진 ${count}장`;
}

export function messagesFor(messages: readonly ChatMessage[], bookingId: string): ChatMessage[] {
  return messages.filter((message) => message.bookingId === bookingId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function unreadCount(messages: readonly ChatMessage[], bookingId?: string): number {
  return messages.filter((message) => message.author === 'guest' && !message.readAt && (bookingId === undefined || message.bookingId === bookingId)).length;
}

export interface ThreadSummary {
  readonly booking: Booking;
  readonly last: ChatMessage;
  readonly unread: number;
  readonly needsReply: boolean;
}

export function threadSummaries(messages: readonly ChatMessage[], bookings: readonly Booking[]): ThreadSummary[] {
  const byBooking = new Map<string, ChatMessage[]>();
  for (const message of messages) {
    const list = byBooking.get(message.bookingId);
    if (list) list.push(message);
    else byBooking.set(message.bookingId, [message]);
  }
  const summaries: ThreadSummary[] = [];
  for (const [bookingId, thread] of byBooking) {
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking) continue;
    const ordered = [...thread].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const last = ordered[ordered.length - 1];
    summaries.push({
      booking,
      last,
      unread: ordered.filter((message) => message.author === 'guest' && !message.readAt).length,
      needsReply: last.author === 'guest',
    });
  }
  return summaries.sort((a, b) => b.last.createdAt.localeCompare(a.last.createdAt));
}

/** 'TK-5521', 'tk-5521', '5521' 모두 같은 예약으로 찾는다. */
export function findByCode(bookings: readonly Booking[], raw: string): Booking | undefined {
  const normalized = raw.trim().toUpperCase();
  if (normalized === '') return undefined;
  const digits = normalized.replace(/^TK-?/, '');
  return bookings.find((b) => b.code.toUpperCase() === normalized || b.code.replace(/^TK-/, '') === digits);
}

