import type { ApprovalReason, BagSize, BookingStatus, TicketKind } from '@/domain/types';

export const STATUS_LABEL: Readonly<Record<BookingStatus, string>> = {
  pending_approval: '확인 필요',
  confirmed: '예정',
  checked_in: '보관 중',
  completed: '완료',
  rejected: '거절',
  expired: '만료',
  no_show: '노쇼',
};

export const REASON_LABEL: Readonly<Record<ApprovalReason, string>> = {
  size_not_accepted: '받지 않는 크기의 짐이 있어요',
  outside_hours: '운영 시간 밖이에요',
  long_stay: '최대 보관 일수를 넘어요',
  group: '단체 예약이에요',
  over_capacity: '그 시간대 보관 공간이 부족해요',
};

export const SIZE_LABEL: Readonly<Record<BagSize, string>> = {
  small: '소',
  medium: '중',
  large: '대',
};

export const SIZE_HINT: Readonly<Record<BagSize, string>> = {
  small: '쇼핑백, 백팩',
  medium: '기내용 캐리어',
  large: '대형 캐리어',
};

export const TICKET_KIND_LABEL: Readonly<Record<TicketKind, string>> = {
  dispute: '분실·파손·분쟁',
  question: '운영 문의',
  other: '기타',
};

