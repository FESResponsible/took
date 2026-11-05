import type { OpenHours } from './types';

export const MINUTE_MS = 60_000;
export const DAY_MS = 24 * 60 * MINUTE_MS;

const HH_MM = /^(\d{2}):(\d{2})$/;

/** 'HH:mm' → 하루 중 몇 분째인지. 형식이 틀리면 예외. */
export function parseHHmm(value: string): number {
  const match = HH_MM.exec(value);
  if (!match) throw new Error(`시간 형식이 올바르지 않아요: ${value}`);
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) throw new Error(`없는 시간이에요: ${value}`);
  return hours * 60 + minutes;
}

export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function isWithinOpenHours(date: Date, hours: OpenHours): boolean {
  const minute = minutesOfDay(date);
  return minute >= parseHHmm(hours.open) && minute <= parseHHmm(hours.close);
}

/** 현지 날짜 'YYYY-MM-DD' */
export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(Date.parse(iso) + minutes * MINUTE_MS).toISOString();
}

export function intervalsOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

