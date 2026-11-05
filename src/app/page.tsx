'use client';

import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';
import { monthPeriod, summarizeSettlement } from '@/domain/settlement';
import { toDateKey } from '@/domain/time';
import { usePartner } from '@/state/PartnerProvider';
import { selectToday } from '@/state/selectors';
import { formatKrw } from '@/ui/format';
import { todayLists } from './today/lists';

const QUICK: ReadonlyArray<{ href: string; label: string; icon: IconName; tone: string }> = [
  { href: '/bookings', label: '예약', icon: 'calendar', tone: 'cyan' },
  { href: '/settlement', label: '정산', icon: 'wallet', tone: 'point' },
  { href: '/settings', label: '보관 조건', icon: 'sliders', tone: 'mint' },
  { href: '/support', label: '문의', icon: 'message', tone: 'cyan' },
  { href: '/scan', label: 'QR 확인', icon: 'qr', tone: 'mint' },
];

export default function TodayPage() {
  const { state, now } = usePartner();
  const view = selectToday(state.bookings, now, state.policy);
  const sections = todayLists(state.bookings, now, state.policy);

  const todayKey = toDateKey(now);
  const todayBookings = state.bookings.filter((booking) => toDateKey(new Date(booking.dropOffAt)) === todayKey);
  const handled = todayBookings.filter((booking) => booking.status === 'completed' || booking.status === 'no_show').length;
  const monthTotal = summarizeSettlement(state.bookings, monthPeriod(now), state.policy).totalKrw;

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
      </section>

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

      <section className="section">
        <h2 className="section-title">예약 현황 보기</h2>
        <div className="tile-grid">
          {sections.map((section) => (
            <Link key={section.id} href={section.href} className="tile">
              <span className="tile-count">{section.items.length}</span>
              <span className="tile-label">{section.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
