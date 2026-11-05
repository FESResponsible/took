'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { newId } from '@/data/ids';
import { resizeImage } from '@/lib/image';
import { ChatCamera } from '@/components/ChatCamera';
import { Icon } from '@/components/icons';
import { usePartner } from '@/state/PartnerProvider';
import { messagesFor } from '@/state/selectors';
import { formatDateTime, formatTime } from '@/ui/format';

const MAX_PHOTOS = 6;
const GUEST_READ_MS = 1600;

interface PendingPhoto {
  readonly id: string;
  readonly src: string;
}

export default function ChatThreadPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { state, dispatch, now } = usePartner();
  const booking = state.bookings.find((item) => item.id === bookingId);
  const messages = messagesFor(state.messages, bookingId);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewer, setViewer] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const lastId = messages[messages.length - 1]?.id;

  useEffect(() => {
    dispatch({ type: 'mark_thread_read', bookingId, now: new Date() });
  }, [bookingId, dispatch]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lastId]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (!viewer) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setViewer(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewer]);

  if (!booking) {
    return (
      <>
        <p className="empty">예약을 찾을 수 없어요.</p>
        <Link href="/chats" className="btn btn-line">
          대화 목록
        </Link>
      </>
    );
  }

  const openGallery = () => fileRef.current?.click();

  const onCapture = async (file: File) => {
    setCameraOpen(false);
    if (pending.length >= MAX_PHOTOS) return;
    setBusy(true);
    try {
      const src = await resizeImage(file);
      setPending((current) => (current.length >= MAX_PHOTOS ? current : [...current, { id: newId(), src }]));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '사진을 올리지 못했어요.');
    } finally {
      setBusy(false);
    }
  };

  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const room = MAX_PHOTOS - pending.length;
    const files = Array.from(event.target.files ?? []).slice(0, room);
    event.target.value = '';
    if (files.length === 0) return;
    setBusy(true);
    try {
      const resized = await Promise.all(files.map((file) => resizeImage(file)));
      setPending((current) => [...current, ...resized.map((src) => ({ id: newId(), src }))]);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '사진을 올리지 못했어요.');
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if ((!body && pending.length === 0) || busy) return;
    const id = newId();
    dispatch({
      type: 'send_message',
      id,
      bookingId: booking.id,
      body,
      photos: pending.map((photo) => photo.src),
      now: new Date(),
    });
    const timer = window.setTimeout(() => {
      dispatch({ type: 'mark_guest_read', id, now: new Date() });
    }, GUEST_READ_MS);
    timers.current.push(timer);
    setDraft('');
    setPending([]);
    setError(null);
  };

  const stamp = (iso: string) => (formatDateTime(iso, now).startsWith('오늘') ? formatTime(iso) : formatDateTime(iso, now));

  return (
    <>
      <Link href="/chats" className="back-link">
        <Icon name="chevronLeft" size={18} />
        대화
      </Link>
      <div className="detail-head">
        <h1 className="page-title">{booking.customerName}</h1>
      </div>
      <p className="muted">{booking.code}</p>

      <div className="thread-log">
        {messages.length === 0 ? <p className="empty">아직 대화가 없어요.</p> : null}
        {messages.map((message, index) => (
          <div key={message.id} className={`bubble-row is-${message.author}`}>
            <div className="bubble">
              {message.photos && message.photos.length > 0 ? (
                <div className="bubble-photos">
                  {message.photos.map((photo, photoIndex) => (
                    <button key={`${message.id}-${photoIndex}`} type="button" className="bubble-photo" onClick={() => setViewer(photo)} aria-label="사진 크게 보기">
                      <img src={photo} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
              {message.body ? <p className="bubble-text">{message.body}</p> : null}
            </div>
            {message.author === 'store' || index === messages.length - 1 ? (
              <div className="bubble-meta">
                {message.author === 'store' ? (
                  <span className={`bubble-receipt ${message.guestReadAt ? 'is-read' : 'is-unread'}`}>{message.guestReadAt ? '읽음(데모)' : '안 읽음(데모)'}</span>
                ) : null}
                {index === messages.length - 1 ? (
                  <time className="bubble-time" dateTime={message.createdAt}>
                    {stamp(message.createdAt)}
                  </time>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="composer" onSubmit={onSubmit}>
        {pending.length > 0 ? (
          <div className="composer-photos">
            {pending.map((photo, index) => (
              <div key={photo.id} className="composer-photo">
                <img src={photo.src} alt="" />
                <button type="button" className="photo-remove" aria-label={`사진 ${index + 1} 지우기`} onClick={() => setPending((current) => current.filter((item) => item.id !== photo.id))}>
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}
        {error ? <p className="field-error">{error}</p> : null}
        <div className="composer-row">
          <button type="button" className="composer-attach" aria-label="카메라로 사진 첨부" disabled={busy || pending.length >= MAX_PHOTOS} onClick={() => setCameraOpen(true)}>
            <Icon name="camera" size={18} />
          </button>
          <button type="button" className="composer-attach" aria-label="앨범에서 사진 첨부" disabled={busy || pending.length >= MAX_PHOTOS} onClick={openGallery}>
            <Icon name="image" size={18} />
          </button>
          <input ref={fileRef} className="composer-file" type="file" accept="image/*" multiple hidden onChange={onFiles} />
          <input
            className="input"
            value={draft}
            maxLength={500}
            placeholder={busy ? '사진 처리 중…' : '메시지를 입력하세요'}
            aria-label="메시지"
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" className="btn btn-accent" disabled={busy || (!draft.trim() && pending.length === 0)}>
            기기에 저장
          </button>
        </div>
      </form>

      {cameraOpen ? <ChatCamera onCapture={onCapture} onClose={() => setCameraOpen(false)} /> : null}

      {viewer ? (
        <button type="button" className="photo-lightbox" onClick={() => setViewer(null)} aria-label="사진 닫기">
          <img src={viewer} alt="첨부 사진" />
        </button>
      ) : null}
    </>
  );
}
