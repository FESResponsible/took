'use client';

import type { Booking } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { formatKrw } from '@/ui/format';
import { totalBags } from '@/domain/bags';

export function NoShowPanel({ booking }: { booking: Booking }) {
  const { state, dispatch } = usePartner();
  const compensation = Math.round(totalBags(booking.bags) * state.policy.payoutPerBagKrw * state.policy.noShowCompensationRate);

  const onNoShow = () => {
    if (window.confirm('노쇼로 처리할까요? 처리 후에는 이 예약으로 짐을 받을 수 없어요.')) {
      dispatch({ type: 'mark_no_show', id: booking.id, now: new Date() });
    }
  };

  return (
    <section className="panel panel-warn">
      <h2 className="panel-title">예약 시간이 지났어요</h2>
      <p className="panel-note">
        손님이 아직 오지 않았다면 노쇼로 처리해 주세요. 노쇼 보상 {formatKrw(compensation)}이 정산에 반영돼요.
      </p>
      <button type="button" className="btn btn-line btn-block" onClick={onNoShow}>
        노쇼로 처리
      </button>
    </section>
  );
}

