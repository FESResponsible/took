'use client';

import { useEffect, useRef, useState } from 'react';

type CameraStatus = 'starting' | 'live' | 'unavailable';

export function ChatCamera({ onCapture, onClose }: { onCapture: (file: File) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>('starting');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unavailable');
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: 'environment' } },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        if (!cancelled) setStatus('live');
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    };

    void start();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      onCapture(new File([blob], 'camera.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.92);
  };

  return (
    <section className="camera-sheet" role="dialog" aria-label="카메라">
      {status === 'unavailable' ? (
        <p className="scan-message">카메라를 켤 수 없어요. 앨범에서 골라 주세요.</p>
      ) : (
        <video ref={videoRef} className="camera-preview" autoPlay muted playsInline aria-label="카메라 미리보기" />
      )}
      <div className="camera-actions">
        {status === 'live' ? (
          <button type="button" className="btn btn-accent" onClick={takePhoto}>
            촬영
          </button>
        ) : null}
        <button type="button" className="btn btn-line" onClick={onClose}>
          닫기
        </button>
      </div>
    </section>
  );
}
