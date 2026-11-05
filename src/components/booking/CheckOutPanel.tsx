'use client';

/* eslint-disable @next/next/no-img-element -- data URL 미리보기 */
import { useState } from 'react';
import { isPickupOverdue } from '@/domain/transitions';
import type { Booking } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { formatDateTime } from '@/ui/format';

export function CheckOutPanel({ booking }: { booking: Booking }) {
  const { dispatch, now } = usePartner();
  const [verified, setVerified] = useState(false);
  const record = booking.checkIn;

  return (
    <section className="panel">
      <h2 className="panel-title">짐 반환</h2>
      {isPickupOverdue(booking, now) && (
        <p className="panel-note note-warn">찾으러 올 시간이 지났어요. 연장 요금은 TooK이 고객에게 청구해요.</p>
      )}
      {record && (
        <>
          <p className="field-label">
            접수할 때 찍은 사진 · {record.bagTotal}개 · {formatDateTime(record.at, now)}
          </p>
          <div className="photo-grid">
            {record.photos.map((photo, index) => (
              <div key={photo.slice(-24) + index} className="photo-thumb">
                <img src={photo} alt={`접수 사진 ${index + 1}`} />
              </div>
            ))}
          </div>
        </>
      )}
      <label className="check-row">
        <input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)} />
        예약번호와 짐을 사진과 대조했어요
      </label>
      <button
        type="button"
        className="btn btn-accent btn-block"
        disabled={!verified}
        onClick={() => dispatch({ type: 'check_out', id: booking.id, now: new Date() })}
      >
        반환 완료
      </button>
    </section>
  );
}

