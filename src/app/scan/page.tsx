'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, type ChangeEvent } from 'react';
import { CodeSearch } from '@/components/CodeSearch';
import { Icon } from '@/components/icons';
import { QrCamera } from '@/components/QrCamera';
import { parseQrPayload } from '@/domain/qr';
import { decodeQrFromFile } from '@/lib/qrDecode';
import { usePartner } from '@/state/PartnerProvider';
import { findByCode } from '@/state/selectors';

export default function ScanPage() {
  const { state } = usePartner();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const handledRef = useRef(false);

  const handleText = (text: string) => {
    if (handledRef.current) return;
    const code = parseQrPayload(text);
    if (!code) {
      setError('TooK 예약 QR이 아니에요. 고객 화면의 QR을 다시 보여 달라고 해 주세요.');
      return;
    }
    const booking = findByCode(state.bookings, code);
    if (!booking) {
      setError(`${code} 예약을 찾지 못했어요. 우리 매장 예약이 맞는지 확인해 주세요.`);
      return;
    }
    handledRef.current = true;
    router.replace(`/bookings/${booking.id}`);
  };

  const onPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await decodeQrFromFile(file);
      if (text) handleText(text);
      else setError('사진에서 QR을 찾지 못했어요. QR이 잘 보이게 다시 찍어 주세요.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '사진을 읽지 못했어요.');
    }
  };

  return (
    <>
      <Link href="/" className="back-link">
        <Icon name="chevronLeft" size={18} />
        오늘
      </Link>
      <h1 className="page-title">QR 확인</h1>

      <QrCamera onDecoded={handleText} />
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      <button type="button" className="btn btn-line btn-block" onClick={() => photoRef.current?.click()}>
        사진 찍어서 QR 읽기
      </button>
      <input ref={photoRef} type="file" accept="image/*" capture="environment" hidden aria-label="QR 사진 선택" onChange={onPhoto} />

      <CodeSearch />
    </>
  );
}

