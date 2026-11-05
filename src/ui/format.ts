import { BAG_SIZES } from '@/domain/bags';
import { toDateKey } from '@/domain/time';
import type { BagCount } from '@/domain/types';
import { SIZE_LABEL } from './labels';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDay(iso: string, now: Date): string {
  const d = new Date(iso);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (toDateKey(d) === toDateKey(now)) return '오늘';
  if (toDateKey(d) === toDateKey(tomorrow)) return '내일';
  if (toDateKey(d) === toDateKey(yesterday)) return '어제';
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

export function formatDateTime(iso: string, now: Date): string {
  return `${formatDay(iso, now)} ${formatTime(iso)}`;
}

export function formatKrw(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function formatRemaining(ms: number): string {
  if (ms <= 0) return '시간 지남';
  const minutes = Math.ceil(ms / 60_000);
  if (minutes < 60) return `${minutes}분 남음`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}시간 남음` : `${hours}시간 ${rest}분 남음`;
}

export function formatBags(bags: BagCount): string {
  return BAG_SIZES.filter((size) => bags[size] > 0)
    .map((size) => `${SIZE_LABEL[size]} ${bags[size]}`)
    .join(' · ');
}

