'use client';

import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { newId } from '@/data/ids';
import type { TicketKind } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { TICKET_KIND_LABEL } from '@/ui/labels';

const KINDS: readonly TicketKind[] = ['dispute', 'question', 'other'];
const MAX_MESSAGE = 500;

export function TicketForm() {
  const { state, dispatch } = usePartner();
  const params = useSearchParams();
  const linked = params.get('booking');
  const [kind, setKind] = useState<TicketKind>(linked ? 'dispute' : 'question');
  const [bookingId, setBookingId] = useState(linked && state.bookings.some((b) => b.id === linked) ? linked : '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 5) {
      setError('어떤 일인지 5자 이상 적어 주세요.');
      return;
    }
    dispatch({
      type: 'add_ticket',
      ticket: { id: newId(), kind, bookingId: bookingId || undefined, message: trimmed, createdAt: new Date().toISOString(), status: 'received' },
    });
    setMessage('');
    setError(null);
  };

  return (
    <form className="form panel" onSubmit={onSubmit}>
      <h2 className="panel-title">문의·분쟁 접수</h2>
      <div className="field">
        <label htmlFor="kind" className="field-label">종류</label>
        <select id="kind" className="input" value={kind} onChange={(e) => setKind(e.target.value as TicketKind)}>
          {KINDS.map((k) => (
            <option key={k} value={k}>{TICKET_KIND_LABEL[k]}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="booking" className="field-label">관련 예약 (선택)</label>
        <select id="booking" className="input" value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
          <option value="">선택 안 함</option>
          {state.bookings.map((b) => (
            <option key={b.id} value={b.id}>{b.code} · {b.customerName}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="message" className="field-label">내용</label>
        <textarea id="message" className="input textarea" maxLength={MAX_MESSAGE} rows={4} placeholder="예: 반환할 때 손님이 캐리어 바퀴 파손을 이야기했어요." value={message} onChange={(e) => setMessage(e.target.value)} />
        <p className="field-hint">{message.length}/{MAX_MESSAGE}</p>
      </div>
      {error && <p className="field-error">{error}</p>}
      <button type="submit" className="btn btn-accent btn-block">접수하기</button>
    </form>
  );
}

