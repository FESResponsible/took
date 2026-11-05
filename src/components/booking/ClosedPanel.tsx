'use client';

/* eslint-disable @next/next/no-img-element -- data URL 미리보기 */
import type { Booking } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { formatDateTime } from '@/ui/format';

const MESSAGES = {
  completed: '보관이 끝난 예약이에요. 정산 탭에 반영됐어요.',
  no_show: '노쇼로 처리한 예약이에요. 노쇼 보상이 정산에 반영됐어요.',
  rejected: '거절한 예약이에요. 고객에게는 안내하지 않았어요.',
  expired: '응답 시간이 지나 자동으로 취소된 예약이에요.',
} as const;

export function ClosedPanel({ booking }: { booking: Booking }) {
  const { now } = usePartner();
  const message = MESSAGES[booking.status as keyof typeof MESSAGES];

  return (
    <section className="panel panel-quiet">
      <p className="panel-note">{message}</p>
      {booking.checkIn && booking.checkedOutAt && (
        <>
          <p className="field-label">
            접수 {formatDateTime(booking.checkIn.at, now)} · 반환 {formatDateTime(booking.checkedOutAt, now)} · {booking.checkIn.bagTotal}개
          </p>
          <div className="photo-grid">
            {booking.checkIn.photos.map((photo, index) => (
              <div key={photo.slice(-24) + index} className="photo-thumb">
                <img src={photo} alt={`접수 사진 ${index + 1}`} />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

