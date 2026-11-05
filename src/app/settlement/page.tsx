'use client';

import Link from 'next/link';
import { SETTLEMENT_CYCLE_LABEL } from '@/config/policy';
import { Icon } from '@/components/icons';
import { monthPeriod, summarizeSettlement } from '@/domain/settlement';
import { usePartner } from '@/state/PartnerProvider';
import { formatDay, formatKrw } from '@/ui/format';

export default function SettlementPage() {
  const { state, now } = usePartner();
  const summary = summarizeSettlement(state.bookings, monthPeriod(now), state.policy);
  const lines = [...summary.lines].reverse();

  return (
    <>
      <Link href="/" className="back-link">
        <Icon name="chevronLeft" size={18} />
        오늘
      </Link>
      <h1 className="page-title">정산</h1>
      <section className="hero-card">
        <p className="hero-label">{now.getMonth() + 1}월 예상 정산액</p>
        <p className="hero-amount">{formatKrw(summary.totalKrw)}</p>
        <p className="hero-sub">{SETTLEMENT_CYCLE_LABEL}</p>
      </section>

      <div className="summary">
        <div className="summary-item">
          <p className="summary-num">{summary.storageCount}건</p>
          <p className="summary-label">보관 완료 · 짐 {summary.bagCount}개</p>
        </div>
        <div className="summary-item">
          <p className="summary-num">{summary.noShowCount}건</p>
          <p className="summary-label">노쇼 보상 {formatKrw(summary.noShowKrw)}</p>
        </div>
      </div>

      <p className="section-desc">
        짐 1개 {formatKrw(state.policy.payoutPerBagKrw)}, 노쇼 {Math.round(state.policy.noShowCompensationRate * 100)}%. 예시 금액이에요.
      </p>

      <h2 className="section-title">이번 달 내역</h2>
      {lines.length === 0 ? (
        <p className="empty">이번 달 정산 내역이 아직 없어요.</p>
      ) : (
        <ul className="ledger">
          {lines.map((line) => (
            <li key={`${line.bookingId}-${line.kind}`} className="ledger-row">
              <div>
                <p className="ledger-title">
                  {line.code} · {line.kind === 'storage' ? `보관 ${line.bags}개` : `노쇼 보상 (짐 ${line.bags}개)`}
                </p>
                <p className="muted">{formatDay(line.date, now)}</p>
              </div>
              <p className="ledger-amount">{formatKrw(line.amountKrw)}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

