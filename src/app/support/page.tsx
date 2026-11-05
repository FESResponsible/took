'use client';

import { Suspense } from 'react';
import { usePartner } from '@/state/PartnerProvider';
import { formatDateTime } from '@/ui/format';
import { TICKET_KIND_LABEL } from '@/ui/labels';
import { Icon } from '@/components/icons';
import { TicketForm } from '@/components/TicketForm';

const looksLikePhone = (value: string) => /^[0-9+\-\s]{8,}$/.test(value);

export default function SupportPage() {
  const { state, now } = usePartner();
  const { store } = state;

  return (
    <>
      <h1 className="page-title">문의</h1>

      <section className="manager-card">
        <div className="manager-row">
          <span className="avatar" aria-hidden="true">
            <Icon name="user" size={22} />
          </span>
          <div>
            <p className="hero-label">전담 담당자</p>
            <p className="manager-name">{store.managerName}</p>
            <p className="muted">
              {store.managerPhone} · {store.managerEmail}
            </p>
          </div>
        </div>
        {looksLikePhone(store.managerPhone) && (
          <a className="btn btn-accent btn-block" href={`tel:${store.managerPhone.replace(/\s/g, '')}`}>
            전화하기
          </a>
        )}
        <p className="section-desc">분쟁 응대는 TooK이 맡아요.</p>
      </section>

      <Suspense fallback={null}>
        <TicketForm />
      </Suspense>

      <h2 className="section-title">접수 내역</h2>
      {state.tickets.length === 0 ? (
        <p className="empty">아직 접수한 문의가 없어요.</p>
      ) : (
        <ul className="ledger">
          {state.tickets.map((ticket) => {
            const booking = state.bookings.find((b) => b.id === ticket.bookingId);
            return (
              <li key={ticket.id} className="ledger-row">
                <div>
                  <p className="ledger-title">
                    {TICKET_KIND_LABEL[ticket.kind]}
                    {booking ? ` · ${booking.code}` : ''}
                  </p>
                  <p className="ticket-message">{ticket.message}</p>
                  <p className="muted">{formatDateTime(ticket.createdAt, now)}</p>
                </div>
                <span className="badge badge-confirmed">접수됨</span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

