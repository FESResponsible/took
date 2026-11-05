'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons';
import { usePartner } from '@/state/PartnerProvider';
import { messagePreview, threadSummaries } from '@/state/selectors';
import { formatDateTime, formatTime } from '@/ui/format';

export default function ChatListPage() {
  const { state, now } = usePartner();
  const threads = threadSummaries(state.messages, state.bookings);

  return (
    <>
      <Link href="/" className="back-link">
        <Icon name="chevronLeft" size={18} />
        오늘
      </Link>
      <h1 className="page-title">대화</h1>
      {threads.length === 0 ? (
        <p className="empty">아직 대화가 없어요.</p>
      ) : (
        <ul className="chat-list">
          {threads.map((thread) => (
            <li key={thread.booking.id}>
              <Link href={`/chats/${thread.booking.id}`} className="chat-row">
                <p className="chat-row-name">
                  {thread.booking.customerName} <span className="chat-row-code">{thread.booking.code}</span>
                </p>
                <p className="chat-row-preview">{messagePreview(thread.last)}</p>
                <span className="chat-row-meta">
                  <span className="chat-row-time">
                    {formatDateTime(thread.last.createdAt, now).startsWith('오늘')
                      ? formatTime(thread.last.createdAt)
                      : formatDateTime(thread.last.createdAt, now)}
                  </span>
                  {thread.unread > 0 ? <span className="chat-unread">{thread.unread}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
