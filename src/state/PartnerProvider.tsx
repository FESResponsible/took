'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import { createLocalStorageRepository } from '@/data/repository';
import { createSeedState } from '@/data/seed';
import { partnerReducer, type PartnerAction, type PartnerState } from './reducer';

const TICK_MS = 30_000;

interface PartnerContextValue {
  readonly state: PartnerState;
  readonly dispatch: Dispatch<PartnerAction>;
  readonly now: Date;
  readonly saveError: string | null;
  readonly resetDemo: () => void;
}

const PartnerContext = createContext<PartnerContextValue | null>(null);

export function PartnerProvider({ children }: { children: ReactNode }) {
  const repository = useMemo(
    () => createLocalStorageRepository(typeof window === 'undefined' ? undefined : window.localStorage),
    [],
  );
  const [state, dispatch] = useReducer(partnerReducer, undefined, () => createSeedState(new Date()));
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const current = new Date();
    dispatch({ type: 'reset', state: repository.load() ?? createSeedState(current) });
    dispatch({ type: 'tick', now: current });
    setNow(current);
    setReady(true);
  }, [repository]);

  useEffect(() => {
    if (!ready) return;
    const result = repository.save(state);
    setSaveError(result.ok ? null : result.error);
  }, [ready, repository, state]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = new Date();
      setNow(current);
      dispatch({ type: 'tick', now: current });
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const value = useMemo<PartnerContextValue>(
    () => ({
      state,
      dispatch,
      now,
      saveError,
      resetDemo: () => {
        repository.clear();
        dispatch({ type: 'reset', state: { ...createSeedState(new Date()), notice: { kind: 'success', message: '데모 데이터를 처음 상태로 되돌렸어요.' } } });
      },
    }),
    [state, now, saveError, repository],
  );

  if (!ready) {
    return <div className="loading">불러오는 중…</div>;
  }
  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
}

export function usePartner(): PartnerContextValue {
  const context = useContext(PartnerContext);
  if (!context) throw new Error('usePartner는 PartnerProvider 안에서만 쓸 수 있어요.');
  return context;
}

