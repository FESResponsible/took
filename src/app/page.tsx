'use client';

import Link from 'next/link';
import { BookingCard } from '@/components/BookingCard';
import { CodeSearch } from '@/components/CodeSearch';
import { DemoPanel } from '@/components/DemoPanel';
import { Icon, type IconName } from '@/components/icons';
import { Section } from '@/components/Section';
import { isPickupOverdue } from '@/domain/transitions';
import { usePartner } from '@/state/PartnerProvider';
import { selectToday, threadSummaries, unreadCount } from '@/state/selectors';
import { formatRemaining, formatTime } from '@/ui/format';
import { REASON_LABEL } from '@/ui/labels';

const QUICK: ReadonlyArray<{ href: string; label: string; icon: IconName; tone: string }> = [
  { href: '/scan', label: 'QR 확인', icon: 'qr', tone: 'mint' },
  { href: '/bookings', label: '예약', icon: 'calendar', tone: 'cyan' },
  { href: '/settlement', label: '정산', icon: 'wallet', tone: 'point' },
  { href: '/settings', label: '보관 조건', icon: 'sliders', tone: 'mint' },
  { href: '/support', label: '문의', icon: 'message', tone: 'cyan' },
];

export default function TodayPage() {
  const { state, now } = usePartner();
  const view = selectToday(state.bookings, now, state.policy);
  const threads = threadSummaries(state.messages, state.bookings);
  const replyCount = threads.filter((thread) => thread.needsReply).length;
  const unread = unreadCount(state.messages);
  const msUntil = (iso: string) => Date.parse(iso) - now.getTime();

  return (
    <>
      <h1 className="sr-only">오늘</h1>
      <div className="summary">
        <div className="summary-item">
          <p className="summary-num">{view.arrivingToday.length + view.noShowCandidates.length}</p>
          <p className="summary-label">오늘 맡기러 올 손님</p>
        </div>
        <div className="summary-item">
          <p className="summary-num">{view.bagsInStorage}</p>
          <p className="summary-label">지금 보관 중인 짐</p>
        </div>
      </div>

      <nav className="quick-grid" aria-label="바로가기">
        {QUICK.map((item) => (
          <Link key={item.href} href={item.href} className="quick-item">
            {item.href === '/bookings' && view.pending.length > 0 ? <span className="qa-pill">확인 필요</span> : null}
            <span className={`qa-icon qa-${item.tone}`}>
              <Icon name={item.icon} size={22} />
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {replyCount > 0 ? (
        <Link href="/chats" className="chat-shortcut">
          <span className="qa-icon qa-cyan">
            <Icon name="message" size={20} />
          </span>
          <span className="chat-shortcut-copy">
            <strong>데모 대화</strong>
            <span className="notice-sub">이 기기에만 있고 손님에게 안 가요</span>
          </span>
          {unread > 0 ? <span className="chat-unread">{unread}</span> : null}
        </Link>
      ) : null}

      <CodeSearch />

      <Section
        title="확인 필요"
        count={view.pending.length}
        isEmpty={view.pending.length === 0}
        empty="확인할 예약이 없어요."
      >
        {view.pending.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            now={now}
            hintTone="warn"
            hint={`${b.approvalReasons.map((r) => REASON_LABEL[r]).join(', ')} · ${formatRemaining(msUntil(b.approvalDeadline ?? b.createdAt))}`}
          />
        ))}
      </Section>

      {view.noShowCandidates.length > 0 && (
        <Section title="노쇼 확인" count={view.noShowCandidates.length}>
          {view.noShowCandidates.map((b) => (
            <BookingCard key={b.id} booking={b} now={now} hintTone="warn" hint={`${formatTime(b.dropOffAt)} 예약 · 노쇼로 처리할 수 있어요`} />
          ))}
        </Section>
      )}

      <Section title="오늘 맡기러 와요" count={view.arrivingToday.length} isEmpty={view.arrivingToday.length === 0} empty="오늘 남은 예약이 없어요.">
        {view.arrivingToday.map((b) => (
          <BookingCard key={b.id} booking={b} now={now} hint={`${formatRemaining(msUntil(b.dropOffAt)).replace('남음', '뒤 도착')}`} />
        ))}
      </Section>

      <Section title="보관 중" count={view.inStorage.length} isEmpty={view.inStorage.length === 0} empty="보관 중인 짐이 없어요.">
        {view.inStorage.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            now={now}
            hintTone={isPickupOverdue(b, now) ? 'warn' : 'muted'}
            hint={isPickupOverdue(b, now) ? '찾으러 올 시간이 지났어요' : `${formatTime(b.pickUpAt)}에 찾으러 와요`}
          />
        ))}
      </Section>

      <DemoPanel />
    </>
  );
}

