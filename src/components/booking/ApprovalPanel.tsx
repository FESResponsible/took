'use client';

import type { Booking } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { formatRemaining } from '@/ui/format';
import { REASON_LABEL } from '@/ui/labels';

export function ApprovalPanel({ booking }: { booking: Booking }) {
  const { dispatch, now } = usePartner();
  const remaining = booking.approvalDeadline ? Date.parse(booking.approvalDeadline) - now.getTime() : 0;

  const onReject = () => {
    if (window.confirm('이 예약을 거절할까요? 고객에게는 전달되지 않아요.')) {
      dispatch({ type: 'reject', id: booking.id, now: new Date() });
    }
  };

  return (
    <section className="panel panel-warn">
      <h2 className="panel-title">확인이 필요한 예약이에요</h2>
      <ul className="reason-list">
        {booking.approvalReasons.map((reason) => (
          <li key={reason}>{REASON_LABEL[reason]}</li>
        ))}
      </ul>
      <p className="panel-note">응답 시간: {formatRemaining(remaining)}. 시간이 지나면 자동으로 취소돼요.</p>
      <div className="btn-row">
        <button type="button" className="btn btn-line" onClick={onReject}>
          거절
        </button>
        <button type="button" className="btn btn-accent" onClick={() => dispatch({ type: 'approve', id: booking.id, now: new Date() })}>
          받을게요
        </button>
      </div>
    </section>
  );
}

