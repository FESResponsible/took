'use client';

import Link from 'next/link';
import { AppMark, type AppMarkName } from '@/components/AppMark';
import { lifetimePeriod, monthPeriod, summarizeSettlement } from '@/domain/settlement';
import { toDateKey } from '@/domain/time';
import { usePartner } from '@/state/PartnerProvider';
import { selectToday } from '@/state/selectors';
import { formatDay, formatKrw, formatTime } from '@/ui/format';
import { todayLists } from './today/lists';

const QUICK: ReadonlyArray<{ href: string; label: string; mark: AppMarkName; tone: string }> = [
  { href: '/bookings', label: '예약', mark: 'bag', tone: 'bag' },
  { href: '/settlement', label: '정산', mark: 'coins', tone: 'coins' },
  { href: '/settings', label: '보관 조건', mark: 'clock', tone: 'clock' },
  { href: '/support', label: '문의', mark: 'chat', tone: 'chat' },
  { href: '/scan', label: 'QR 확인', mark: 'qr', tone: 'qr' },
];

const TILE_MARK: Record<string, AppMarkName> = {
  stored: 'locker',
  arriving: 'visit',
  pending: 'check',
  'no-show': 'miss',
};

export default function TodayPage() {
  const { state, now } = usePartner();
  const view = selectToday(state.bookings, now, state.policy);
  const sections = todayLists(state.bookings, now, state.policy);

  const todayKey = toDateKey(now);
  const todayBookings = state.bookings.filter((booking) => toDateKey(new Date(booking.dropOffAt)) === todayKey);
  const handled = todayBookings.filter((booking) => booking.status === 'completed' || booking.status === 'no_show').length;
  const monthTotal = summarizeSettlement(state.bookings, monthPeriod(now), state.policy).totalKrw;
  const lifetimeTotal = summarizeSettlement(state.bookings, lifetimePeriod(now), state.policy).totalKrw;
  const accepting = state.settings.pausedOn !== todayKey;
  const nextDropOff = state.bookings
    .filter((booking) => (booking.status === 'confirmed' || booking.status === 'pending_approval') && Date.parse(booking.dropOffAt) > now.getTime())
    .sort((a, b) => a.dropOffAt.localeCompare(b.dropOffAt))[0];
  const nextPickup = state.bookings
    .filter((booking) => booking.status === 'checked_in' && Date.parse(booking.pickUpAt) > now.getTime())
    .sort((a, b) => a.pickUpAt.localeCompare(b.pickUpAt))[0];
  const when = (iso: string) => `${formatDay(iso, now)} ${formatTime(iso)}`;

  return (
    <>
      <h1 className="sr-only">오늘</h1>
      <section className="home-strip" aria-label="오늘 요약">
        <div className="home-stat">
          <p className="home-stat-label">오늘 예약</p>
          <p className="home-stat-value">{todayBookings.length}</p>
          <p className="home-stat-sub">{handled}/{todayBookings.length} 처리</p>
        </div>
        <div className="home-stat">
          <p className="home-stat-label">현재 보관</p>
          <p className="home-stat-value">{view.bagsInStorage}</p>
          <p className="home-stat-sub">짐</p>
        </div>
        <div className="home-stat">
          <p className="home-stat-label">이번 달 예상 수익</p>
          <p className="home-stat-value is-money">{formatKrw(monthTotal)}</p>
        </div>
        <div className="home-stat">
          <p className="home-stat-label">지금까지 번 돈</p>
          <p className="home-stat-value is-money is-lifetime">{formatKrw(lifetimeTotal)}</p>
          <p className="home-stat-sub">데모</p>
        </div>
      </section>

      <nav className="quick-grid" aria-label="바로가기">
        {QUICK.map((item) => (
          <Link key={item.href} href={item.href} className="quick-item">
            {item.href === '/bookings' && view.pending.length > 0 ? <span className="qa-pill">확인 필요</span> : null}
            <span className={`qa-icon qa-${item.tone}`}>
              <AppMark name={item.mark} size={30} />
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <section className="section">
        <h2 className="section-title">예약 현황 보기</h2>
        <div className="tile-grid">
          {sections.map((section) => (
            <Link key={section.id} href={section.href} className="tile">
              <span className="tile-top">
                <span className="tile-count">{section.items.length}</span>
                <AppMark name={TILE_MARK[section.id]} size={28} />
              </span>
              <span className="tile-label">{section.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-facts" aria-label="오늘 메모">
        {nextDropOff ? (
          <Link href={`/bookings/${nextDropOff.id}`} className="home-fact">
            <span className="home-fact-label">다음 맡김</span>
            <span className="home-fact-value">
              {nextDropOff.customerName}
              <span className="home-fact-meta">{when(nextDropOff.dropOffAt)}</span>
            </span>
          </Link>
        ) : (
          <div className="home-fact">
            <span className="home-fact-label">다음 맡김</span>
            <span className="home-fact-value">예정된 맡김이 없어요</span>
          </div>
        )}
        {nextPickup ? (
          <Link href={`/bookings/${nextPickup.id}`} className="home-fact">
            <span className="home-fact-label">다음 찾기</span>
            <span className="home-fact-value">
              {nextPickup.customerName}
              <span className="home-fact-meta">{when(nextPickup.pickUpAt)}</span>
            </span>
          </Link>
        ) : (
          <div className="home-fact">
            <span className="home-fact-label">다음 찾기</span>
            <span className="home-fact-value">예정된 찾기가 없어요</span>
          </div>
        )}
        <div className="home-fact">
          <span className="home-fact-label">예약 받기</span>
          <span className="home-fact-value">{accepting ? '오늘 예약 받는 중' : '오늘 예약 멈춤'}</span>
        </div>
      </section>
    </>
  );
}
