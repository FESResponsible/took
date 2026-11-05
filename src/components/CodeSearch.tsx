'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { usePartner } from '@/state/PartnerProvider';
import { findByCode } from '@/state/selectors';
import { Icon } from './icons';

export function CodeSearch() {
  const { state } = usePartner();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = findByCode(state.bookings, code);
    if (!found) {
      setError('그 예약번호를 찾지 못했어요. 고객 화면의 번호를 다시 확인해 주세요.');
      return;
    }
    setError(null);
    router.push(`/bookings/${found.id}`);
  };

  return (
    <form className="code-search" onSubmit={onSubmit}>
      <label htmlFor="code" className="field-label">
        예약번호로 찾기
      </label>
      <div className="code-row">
        <input
          id="code"
          className="input"
          inputMode="text"
          autoComplete="off"
          placeholder="예: TK-2041"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
        <button type="submit" className="btn btn-dark code-submit" aria-label="찾기">
          <Icon name="search" size={18} />
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </form>
  );
}

