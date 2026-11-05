import type { BookingStatus } from '@/domain/types';

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending_approval: '확인 필요',
  confirmed: '예정',
  checked_in: '보관 중',
  completed: '완료',
  rejected: '거절',
  expired: '만료',
  no_show: '노쇼',
};

export type BookingFilter = 'all' | 'pending' | 'upcoming' | 'stored' | 'done' | 'noshow' | 'other';

export const FILTERS: ReadonlyArray<{ id: BookingFilter; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'pending', label: '확인 필요' },
  { id: 'upcoming', label: '예정' },
  { id: 'stored', label: '보관 중' },
  { id: 'done', label: '완료' },
  { id: 'noshow', label: '노쇼' },
  { id: 'other', label: '기타' },
];

const FILTER_STATUSES: Record<Exclude<BookingFilter, 'all'>, readonly BookingStatus[]> = {
  pending: ['pending_approval'],
  upcoming: ['confirmed'],
  stored: ['checked_in'],
  done: ['completed'],
  noshow: ['no_show'],
  other: ['rejected', 'expired'],
};

export function matchesFilter(status: BookingStatus, filter: BookingFilter): boolean {
  if (filter === 'all') return true;
  return FILTER_STATUSES[filter].includes(status);
}
