'use client';

import { useState, type FormEvent } from 'react';
import { useSupplier } from '@/state/SupplierProvider';
import { storeName } from '@/state/selectors';
import { formatWhen } from '@/ui/format';

export default function InquiriesPage() {
  const { state, now, addNote } = useSupplier();
  const [inquiryId, setInquiryId] = useState(state.inquiries[0]?.id ?? '');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inquiryId || body.trim() === '') return;
    addNote(inquiryId, body);
    setBody('');
    setSaved(true);
  };

  return (
    <>
      <header className="page-head">
        <h1>문의</h1>
        <p>매장에서 온 것처럼 만든 예시 문의입니다. 메모는 이 기기에만 남고 매장에 전달되지 않아요.</p>
      </header>
      <ul className="inquiry-list">
        {state.inquiries.map((inquiry) => {
          const notes = state.notes.filter((note) => note.inquiryId === inquiry.id);
          return (
            <li key={inquiry.id} className="inquiry-card">
              <div className="inquiry-top">
                <div>
                  <p className="card-kicker">
                    {storeName(state.stores, inquiry.storeId)} {formatWhen(inquiry.createdAt, now)}
                  </p>
                  <h2>{inquiry.title}</h2>
                </div>
                <span className={notes.length > 0 ? 'pill pill-on' : 'pill pill-wait'}>{notes.length > 0 ? '기기 메모 있음' : '예시 문의'}</span>
              </div>
              <p>{inquiry.body}</p>
              {notes.length > 0 ? (
                <ul className="note-list">
                  {notes.map((note) => (
                    <li key={note.id}>
                      <span>이 기기에만 있음, {formatWhen(note.createdAt, now)}</span>
                      <p>{note.body}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>

      <form className="panel note-form" onSubmit={onSubmit}>
        <h2>메모 남기기</h2>
        <p>저장해도 매장이나 손님에게 보내지 않습니다.</p>
        <label htmlFor="inquiry">문의</label>
        <select id="inquiry" value={inquiryId} onChange={(event) => setInquiryId(event.target.value)}>
          {state.inquiries.map((inquiry) => (
            <option key={inquiry.id} value={inquiry.id}>
              {storeName(state.stores, inquiry.storeId)} / {inquiry.title}
            </option>
          ))}
        </select>
        <label htmlFor="note">메모</label>
        <textarea id="note" value={body} onChange={(event) => setBody(event.target.value)} rows={4} placeholder="이 기기에만 남을 메모" />
        <button type="submit" className="btn">
          이 기기에 저장
        </button>
        {saved ? <p className="save-note">이 기기에만 저장했어요. 매장에 전달되지 않아요.</p> : null}
      </form>
    </>
  );
}
