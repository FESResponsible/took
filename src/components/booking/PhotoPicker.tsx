'use client';

/* eslint-disable @next/next/no-img-element -- data URL 미리보기라 next/image 최적화가 필요 없다 */
import { useRef, useState, type ChangeEvent } from 'react';
import { resizeImage } from '@/lib/image';

const MAX_PHOTOS = 4;

interface PhotoPickerProps {
  readonly photos: readonly string[];
  readonly onChange: (photos: string[]) => void;
}

export function PhotoPicker({ photos, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_PHOTOS - photos.length);
    event.target.value = '';
    if (files.length === 0) return;
    setBusy(true);
    try {
      const resized = await Promise.all(files.map((file) => resizeImage(file)));
      onChange([...photos, ...resized]);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '사진을 올리지 못했어요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="photo-picker">
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div key={photo.slice(-24) + index} className="photo-thumb">
            <img src={photo} alt={`접수 사진 ${index + 1}`} />
            <button
              type="button"
              className="photo-remove"
              aria-label={`사진 ${index + 1} 지우기`}
              onClick={() => onChange(photos.filter((_, i) => i !== index))}
            >
              ×
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button type="button" className="photo-add" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? '처리 중…' : '+ 사진 찍기'}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" multiple hidden onChange={onFiles} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

