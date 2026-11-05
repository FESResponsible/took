import { totalBags } from './bags';
import type { Booking, Policy } from './types';

export interface Period {
  readonly from: Date;
  /** 이 시각은 포함하지 않는다 */
  readonly to: Date;
}

export interface SettlementLine {
  readonly bookingId: string;
  readonly code: string;
  readonly date: string;
  readonly kind: 'storage' | 'no_show';
  readonly bags: number;
  readonly amountKrw: number;
}

export interface SettlementSummary {
  readonly lines: readonly SettlementLine[];
  readonly storageCount: number;
  readonly noShowCount: number;
  readonly bagCount: number;
  readonly storageKrw: number;
  readonly noShowKrw: number;
  readonly totalKrw: number;
}

export function monthPeriod(date: Date): Period {
  return {
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 1),
  };
}

function inPeriod(iso: string, period: Period): boolean {
  const time = Date.parse(iso);
  return time >= period.from.getTime() && time < period.to.getTime();
}

function toLines(booking: Booking, period: Period, policy: Policy): SettlementLine[] {
  const base = { bookingId: booking.id, code: booking.code };
  if (booking.status === 'completed' && booking.checkedOutAt && inPeriod(booking.checkedOutAt, period)) {
    const bags = booking.checkIn?.bagTotal ?? totalBags(booking.bags);
    return [{ ...base, date: booking.checkedOutAt, kind: 'storage', bags, amountKrw: bags * policy.payoutPerBagKrw }];
  }
  if (booking.status === 'no_show' && booking.noShowAt && inPeriod(booking.noShowAt, period)) {
    const bags = totalBags(booking.bags);
    const amountKrw = Math.round(bags * policy.payoutPerBagKrw * policy.noShowCompensationRate);
    return [{ ...base, date: booking.noShowAt, kind: 'no_show', bags, amountKrw }];
  }
  return [];
}

const sumAmount = (lines: readonly SettlementLine[]): number => lines.reduce((sum, line) => sum + line.amountKrw, 0);

export function summarizeSettlement(bookings: readonly Booking[], period: Period, policy: Policy): SettlementSummary {
  const lines = bookings
    .flatMap((booking) => toLines(booking, period, policy))
    .sort((a, b) => a.date.localeCompare(b.date));
  const storage = lines.filter((line) => line.kind === 'storage');
  const noShow = lines.filter((line) => line.kind === 'no_show');
  return {
    lines,
    storageCount: storage.length,
    noShowCount: noShow.length,
    bagCount: storage.reduce((sum, line) => sum + line.bags, 0),
    storageKrw: sumAmount(storage),
    noShowKrw: sumAmount(noShow),
    totalKrw: sumAmount(lines),
  };
}

