'use client';

import { newBookingCode, newId } from '@/data/ids';
import type { BagCount } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';

interface Preset {
  readonly label: string;
  readonly customerName: string;
  readonly customerLanguage: string;
  readonly bags: BagCount;
  readonly dropHour: number;
  readonly stayDays: number;
  readonly pickHour: number;
}

const PRESETS: readonly Preset[] = [
  { label: '내일 11시 · 짐 2개', customerName: 'Hannah Lee', customerLanguage: '영어', bags: { small: 0, medium: 2, large: 0 }, dropHour: 11, stayDays: 0, pickHour: 16 },
  { label: '내일 11시 · 단체 짐 6개', customerName: 'Zhang Wei', customerLanguage: '중국어', bags: { small: 0, medium: 4, large: 2 }, dropHour: 11, stayDays: 0, pickHour: 18 },
  { label: '내일 10시 · 대형 짐 5일 보관', customerName: 'Yamada Ken', customerLanguage: '일본어', bags: { small: 0, medium: 0, large: 1 }, dropHour: 10, stayDays: 5, pickHour: 10 },
];

/** 미팅 시연용: 고객 예약이 들어왔을 때 자동 확정과 확인 필요가 어떻게 갈리는지 보여 준다. */
export function DemoPanel() {
  const { state, dispatch } = usePartner();

  const simulate = (preset: Preset) => {
    const now = new Date();
    const at = (dayOffset: number, hour: number) =>
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hour).toISOString();
    dispatch({
      type: 'simulate_booking',
      now,
      input: {
        id: newId(),
        code: newBookingCode(state.bookings.map((b) => b.code)),
        customerName: preset.customerName,
        customerLanguage: preset.customerLanguage,
        request: { bags: preset.bags, dropOffAt: at(1, preset.dropHour), pickUpAt: at(1 + preset.stayDays, preset.pickHour) },
      },
    });
  };

  return (
    <section className="demo">
      <h2 className="demo-title">시연용 예약</h2>
      <div className="demo-actions">
        {PRESETS.map((preset) => (
          <button key={preset.label} type="button" className="btn btn-line" onClick={() => simulate(preset)}>
            {preset.label}
          </button>
        ))}
      </div>
    </section>
  );
}

