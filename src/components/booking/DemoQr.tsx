'use client';

/* eslint-disable @next/next/no-img-element -- 브라우저에서 만든 QR data URL */
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { buildQrPayload } from '@/domain/qr';

/** 고객용 화면이 아직 없어서, 시연할 때 고객이 보여 줄 QR을 여기서 띄운다. */
export function DemoQr({ code }: { code: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(buildQrPayload(code), { width: 240, margin: 2 })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <details className="demo">
      <summary>데모: 고객이 보여 줄 QR 보기</summary>
      {failed && <p className="field-error">QR을 만들지 못했어요.</p>}
      {src && <img className="demo-qr" src={src} width={240} height={240} alt={`${code} 예약 QR`} />}
      <p className="section-desc">다른 기기로 이 QR을 스캔하면 이 예약이 열려요.</p>
    </details>
  );
}

