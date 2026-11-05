import { isPickupOverdue } from '@/domain/transitions';
import type { Booking, Policy } from '@/domain/types';
import { selectToday } from '@/state/selectors';
import { formatRemaining, formatTime } from '@/ui/format';
import { REASON_LABEL } from '@/ui/labels';

export type TodayListId = 'stored' | 'arriving' | 'pending' | 'no-show';

export interface TodayListItem {
  readonly booking: Booking;
  readonly hint: string;
  readonly hintTone: 'warn' | 'muted';
}

export interface TodayList {
  readonly id: TodayListId;
  readonly href: string;
  readonly label: string;
  readonly items: readonly TodayListItem[];
}

export function todayLists(bookings: readonly Booking[], now: Date, policy: Policy): TodayList[] {
  const view = selectToday(bookings, now, policy);
  const msUntil = (iso: string) => Date.parse(iso) - now.getTime();
  return [
    {
      id: 'stored',
      href: '/today/stored',
      label: '보관 중',
      items: view.inStorage.map((booking) => ({
        booking,
        hint: isPickupOverdue(booking, now) ? '찾으러 올 시간이 지났어요' : `${formatTime(booking.pickUpAt)}에 찾으러 와요`,
        hintTone: isPickupOverdue(booking, now) ? 'warn' : 'muted',
      })),
    },
    {
      id: 'arriving',
      href: '/today/arriving',
      label: '금일 방문 예정',
      items: view.arrivingToday.map((booking) => ({
        booking,
        hint: formatRemaining(msUntil(booking.dropOffAt)).replace('남음', '뒤 도착'),
        hintTone: 'muted',
      })),
    },
    {
      id: 'pending',
      href: '/today/pending',
      label: '확인 필요',
      items: view.pending.map((booking) => ({
        booking,
        hint: `${booking.approvalReasons.map((reason) => REASON_LABEL[reason]).join(', ')} · ${formatRemaining(msUntil(booking.approvalDeadline ?? booking.createdAt))}`,
        hintTone: 'warn',
      })),
    },
    {
      id: 'no-show',
      href: '/today/no-show',
      label: '노쇼 관리',
      items: view.noShowCandidates.map((booking) => ({
        booking,
        hint: `${formatTime(booking.dropOffAt)} 예약 · 노쇼로 처리할 수 있어요`,
        hintTone: 'warn',
      })),
    },
  ];
}
