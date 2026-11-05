'use client';

import { useEffect } from 'react';
import { usePartner } from '@/state/PartnerProvider';

const AUTO_HIDE_MS = 3500;

export function NoticeToast() {
  const { state, dispatch } = usePartner();
  const notice = state.notice;

  useEffect(() => {
    if (!notice || notice.kind === 'error') return;
    const timer = window.setTimeout(() => dispatch({ type: 'dismiss_notice' }), AUTO_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [notice, dispatch]);

  if (!notice) return null;
  return (
    <div className={`toast toast-${notice.kind}`} role={notice.kind === 'error' ? 'alert' : 'status'}>
      <p>{notice.message}</p>
      <button type="button" className="toast-close" onClick={() => dispatch({ type: 'dismiss_notice' })} aria-label="알림 닫기">
        닫기
      </button>
    </div>
  );
}

