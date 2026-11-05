'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import { BAG_SIZES } from '@/domain/bags';
import type { StoreSettings } from '@/domain/types';
import { usePartner } from '@/state/PartnerProvider';
import { SIZE_HINT, SIZE_LABEL } from '@/ui/labels';

function NumberField({ id, label, hint, value, onChange }: { id: string; label: string; hint: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} className="input" type="number" inputMode="numeric" min={1} value={Number.isNaN(value) ? '' : value} onChange={(e) => onChange(e.target.valueAsNumber)} />
      <p className="field-hint">{hint}</p>
    </div>
  );
}

export default function SettingsPage() {
  const { state, dispatch, resetDemo } = usePartner();
  const [draft, setDraft] = useState<StoreSettings>(state.settings);
  const update = (patch: Partial<StoreSettings>) => setDraft((current) => ({ ...current, ...patch }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: 'update_settings', settings: { ...draft, pausedOn: state.settings.pausedOn } });
  };

  return (
    <>
      <Link href="/" className="back-link">
        <Icon name="chevronLeft" size={18} />
        오늘
      </Link>
      <h1 className="page-title">보관 조건</h1>
      <p className="section-desc">조건 안 예약은 자동으로 확정돼요.</p>

      <form className="form panel" onSubmit={onSubmit}>
        <NumberField id="max-bags" label="동시에 보관할 수 있는 최대 짐 개수" hint="같은 시간대에 이보다 많아지면 확인을 요청해요." value={draft.maxBagsAtOnce} onChange={(n) => update({ maxBagsAtOnce: n })} />

        <fieldset className="field">
          <legend className="field-label">받을 수 있는 짐 크기</legend>
          {BAG_SIZES.map((size) => (
            <label key={size} className="check-row">
              <input
                type="checkbox"
                checked={draft.acceptedSizes[size]}
                onChange={(e) => update({ acceptedSizes: { ...draft.acceptedSizes, [size]: e.target.checked } })}
              />
              {SIZE_LABEL[size]} <span className="muted">({SIZE_HINT[size]})</span>
            </label>
          ))}
        </fieldset>

        <div className="field">
          <span className="field-label">운영 시간</span>
          <div className="time-row">
            <input aria-label="여는 시간" className="input" type="time" value={draft.openHours.open} onChange={(e) => update({ openHours: { ...draft.openHours, open: e.target.value } })} />
            <span>~</span>
            <input aria-label="닫는 시간" className="input" type="time" value={draft.openHours.close} onChange={(e) => update({ openHours: { ...draft.openHours, close: e.target.value } })} />
          </div>
        </div>

        <NumberField id="max-days" label="최대 보관 일수" hint="이보다 길면 확인을 요청해요." value={draft.maxStorageDays} onChange={(n) => update({ maxStorageDays: n })} />
        <NumberField id="group" label="단체 기준 (짐 개수)" hint="한 예약의 짐이 이 개수 이상이면 확인을 요청해요." value={draft.groupBagThreshold} onChange={(n) => update({ groupBagThreshold: n })} />

        <button type="submit" className="btn btn-accent btn-block">
          저장
        </button>
      </form>

      <section className="panel panel-quiet">
        <h2 className="panel-title">데모 데이터</h2>
        <p className="panel-note">시연을 처음부터 다시 하고 싶을 때 눌러 주세요. 지금 기록은 모두 지워져요.</p>
        <button type="button" className="btn btn-line btn-block" onClick={() => window.confirm('데모 데이터를 처음 상태로 되돌릴까요?') && resetDemo()}>
          처음 상태로 되돌리기
        </button>
      </section>
    </>
  );
}

