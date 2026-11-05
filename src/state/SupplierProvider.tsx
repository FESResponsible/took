'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { isDemoStore, storeExists } from '@/data/accounts';
import { createSeed } from '@/data/seed';
import type { Note, Store, SupplierState } from '@/domain/types';

const STORAGE_KEY = 'took-supplier-state-v1';
const SESSION_KEY = 'took-supplier-session';

type Action = { type: 'hydrate'; state: SupplierState } | { type: 'add_note'; note: Note };

function reducer(state: SupplierState, action: Action): SupplierState {
  if (action.type === 'hydrate') return action.state;
  return { ...state, notes: [action.note, ...state.notes] };
}

function readState(): SupplierState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SupplierState;
    if (parsed.version !== 1 || !Array.isArray(parsed.stores) || !Array.isArray(parsed.bookings)) return null;
    return { ...parsed, notes: parsed.notes ?? [], inquiries: parsed.inquiries ?? [] };
  } catch {
    return null;
  }
}

interface SupplierContextValue {
  /** 고른 매장만 담는다. 매장을 고르기 전에는 비어 있다. */
  readonly state: SupplierState;
  readonly now: Date;
  readonly storeId: string | null;
  readonly addNote: (inquiryId: string, body: string) => void;
  readonly selectStore: (storeId: string) => boolean;
  readonly clearStore: () => void;
}

function readSession(stores: readonly Store[]): string | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { storeId?: string };
    if (!parsed.storeId || !isDemoStore(parsed.storeId) || !storeExists(stores, parsed.storeId)) return null;
    return parsed.storeId;
  } catch {
    return null;
  }
}

function scopeState(state: SupplierState, storeId: string | null): SupplierState {
  if (!storeId) return { ...state, stores: [], bookings: [], inquiries: [], notes: [] };
  const stores = state.stores.filter((store) => store.id === storeId);
  const bookings = state.bookings.filter((booking) => booking.storeId === storeId);
  const inquiries = state.inquiries.filter((inquiry) => inquiry.storeId === storeId);
  const inquiryIds = new Set(inquiries.map((inquiry) => inquiry.id));
  const notes = state.notes.filter((note) => inquiryIds.has(note.inquiryId));
  return { ...state, stores, bookings, inquiries, notes };
}

const SupplierContext = createContext<SupplierContextValue | null>(null);

export function SupplierProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [now] = useState(() => new Date());
  const [storeId, setStoreId] = useState<string | null>(null);
  const [state, dispatch] = useReducer(reducer, undefined, () => createSeed(new Date()));

  useEffect(() => {
    const next = readState() ?? createSeed(new Date());
    dispatch({ type: 'hydrate', state: next });
    setStoreId(readSession(next.stores));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const value = useMemo<SupplierContextValue>(
    () => ({
      state: scopeState(state, storeId),
      now,
      storeId,
      addNote: (inquiryId, body) => {
        const trimmed = body.trim();
        if (!storeId || trimmed === '') return;
        const inquiry = state.inquiries.find((item) => item.id === inquiryId && item.storeId === storeId);
        if (!inquiry) return;
        dispatch({
          type: 'add_note',
          note: { id: `note-${Date.now()}`, inquiryId, body: trimmed, createdAt: new Date().toISOString() },
        });
      },
      selectStore: (nextStoreId) => {
        if (!isDemoStore(nextStoreId) || !storeExists(state.stores, nextStoreId)) return false;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ storeId: nextStoreId }));
        setStoreId(nextStoreId);
        return true;
      },
      clearStore: () => {
        sessionStorage.removeItem(SESSION_KEY);
        setStoreId(null);
      },
    }),
    [state, now, storeId],
  );

  if (!ready) return <p className="loading">불러오는 중</p>;
  return <SupplierContext.Provider value={value}>{children}</SupplierContext.Provider>;
}

export function useSupplier(): SupplierContextValue {
  const value = useContext(SupplierContext);
  if (!value) throw new Error('SupplierProvider 안에서만 쓸 수 있어요.');
  return value;
}
