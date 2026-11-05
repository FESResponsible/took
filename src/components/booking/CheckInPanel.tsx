'use client';

import { useState } from 'react';
import { totalBags } from '@/domain/bags';
import type { Booking } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { PhotoPicker } from './PhotoPicker';

export function CheckInPanel({ booking }: { booking: Booking }) {
  const { dispatch } = usePartner();
  const booked = totalBags(booking.bags);
  const [photos, setPhotos] = useState<string[]>([]);
  const [bagTotal, setBagTotal] = useState(booked);

  const onSubmit = () => {
    dispatch({ type: 'check_in', id: booking.id, input: { now: new Date(), photos, bagTotal } });
  };

  return (
    <section className="panel">
      <h2 className="panel-title">짐 접수</h2>
      <ol className="steps">
        <li>이 화면이 고객의 예약({booking.code})이 맞는지 확인해요.</li>
        <li>맡기는 짐을 사진으로 남겨요. 분쟁이 생기면 근거가 돼요.</li>
        <li>짐 개수를 세고 접수 완료를 눌러요.</li>
      </ol>

      <p className="field-label">짐 사진 (1장 이상)</p>
      <PhotoPicker photos={photos} onChange={setPhotos} />

      <p className="field-label">맡긴 짐 개수</p>
      <div className="stepper">
        <button type="button" className="btn btn-line" aria-label="한 개 빼기" onClick={() => setBagTotal((n) => Math.max(1, n - 1))}>
          −
        </button>
        <span className="stepper-value" aria-live="polite">
          {bagTotal}개
        </span>
        <button type="button" className="btn btn-line" aria-label="한 개 더하기" onClick={() => setBagTotal((n) => n + 1)}>
          +
        </button>
      </div>
      {bagTotal !== booked && (
        <p className="panel-note note-warn">예약한 개수({booked}개)와 달라요. 이대로 접수하면 실제 개수로 정산돼요.</p>
      )}

      <button type="button" className="btn btn-accent btn-block" disabled={photos.length === 0} onClick={onSubmit}>
        접수 완료
      </button>
    </section>
  );
}

