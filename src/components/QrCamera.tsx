'use client';

import { useEffect, useRef, useState } from 'react';
import { decodeQr } from '@/lib/qrDecode';

const SCAN_INTERVAL_MS = 200;

type CameraState = 'starting' | 'scanning' | 'unavailable';

function useQrCamera(onDecoded: (text: string) => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const callbackRef = useRef(onDecoded);
  const [state, setState] = useState<CameraState>('starting');

  useEffect(() => {
    callbackRef.current = onDecoded;
  }, [onDecoded]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let frame = 0;
    let cancelled = false;
    let lastScan = 0;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    const scan = (time: number) => {
      if (cancelled) return;
      const video = videoRef.current;
      if (video && context && video.readyState >= 2 && time - lastScan >= SCAN_INTERVAL_MS) {
        lastScan = time;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        const text = decodeQr(image.data, image.width, image.height);
        if (text) callbackRef.current(text);
      }
      frame = requestAnimationFrame(scan);
    };

    const start = async () => {
      // https나 localhost가 아니면 mediaDevices 자체가 없다.
      if (!navigator.mediaDevices?.getUserMedia) {
        setState('unavailable');
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setState('scanning');
        frame = requestAnimationFrame(scan);
      } catch {
        if (!cancelled) setState('unavailable');
      }
    };

    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { videoRef, state };
}

export function QrCamera({ onDecoded }: { onDecoded: (text: string) => void }) {
  const { videoRef, state } = useQrCamera(onDecoded);

  if (state === 'unavailable') {
    return <p className="scan-message">카메라를 켤 수 없어요. 아래에서 사진을 찍어 QR을 읽거나 예약번호를 입력해 주세요.</p>;
  }
  return (
    <div className="scan-frame">
      <video ref={videoRef} className="scan-video" muted playsInline aria-label="QR 스캔 카메라 화면" />
      <div className="scan-guide" aria-hidden="true" />
      <p className="scan-caption">{state === 'starting' ? '카메라를 켜는 중…' : '고객의 QR을 네모 안에 맞춰 주세요'}</p>
    </div>
  );
}

