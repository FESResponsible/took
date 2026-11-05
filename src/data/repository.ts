import { createSeedMessages } from '@/data/seed';
import type { ChatMessage } from '@/domain/types';
import type { PartnerState } from '@/state/reducer';

/** localStorage와 같은 모양. 테스트에서는 메모리 구현을 넣는다. */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type SaveResult = { readonly ok: true } | { readonly ok: false; readonly error: string };

/**
 * 화면은 이 인터페이스만 안다. 실제 서비스에서는 API를 부르는 구현으로 바꾸면 된다.
 */
export interface PartnerRepository {
  load(): PartnerState | null;
  save(state: PartnerState): SaveResult;
  clear(): void;
}

export const STORAGE_KEY = 'took-partner-state-v1';

function readMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value)) return null;
  const messages: ChatMessage[] = [];
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue;
    const message = item as Partial<ChatMessage>;
    if (typeof message.id !== 'string' || typeof message.bookingId !== 'string') continue;
    if (message.author !== 'guest' && message.author !== 'store') continue;
    if (typeof message.body !== 'string' || typeof message.createdAt !== 'string') continue;
    const photos = Array.isArray(message.photos)
      ? message.photos.filter((photo): photo is string => typeof photo === 'string' && photo.startsWith('data:image/'))
      : [];
    messages.push({
      id: message.id,
      bookingId: message.bookingId,
      author: message.author,
      body: message.body,
      createdAt: message.createdAt,
      photos: photos.length > 0 ? photos : undefined,
      readAt: typeof message.readAt === 'string' ? message.readAt : undefined,
      guestReadAt: typeof message.guestReadAt === 'string' ? message.guestReadAt : undefined,
    });
  }
  return messages;
}

/** 이미 저장된 대화에도 사진 시드와 읽음/안 읽음 시드를 한 번씩 보탠다. */
function withSeedMessages(saved: readonly ChatMessage[] | null): ChatMessage[] {
  const seed = createSeedMessages(new Date());
  if (!saved) return seed;
  const known = new Set(saved.map((message) => message.id));
  const merged = saved.map((message) => {
    if (message.id !== 'seed-m5' || message.guestReadAt) return message;
    const seeded = seed.find((item) => item.id === 'seed-m5');
    return seeded?.guestReadAt ? { ...message, guestReadAt: seeded.guestReadAt } : message;
  });
  for (const item of seed) {
    if ((item.id === 'seed-m6' || item.id === 'seed-m7') && !known.has(item.id)) merged.push(item);
  }
  return merged;
}

function isPartnerState(value: unknown): value is PartnerState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<PartnerState>;
  return (
    candidate.version === 1 &&
    Array.isArray(candidate.bookings) &&
    Array.isArray(candidate.tickets) &&
    typeof candidate.settings === 'object' &&
    typeof candidate.store === 'object' &&
    typeof candidate.policy === 'object'
  );
}

export function createLocalStorageRepository(
  storage: KeyValueStorage | undefined,
  key: string = STORAGE_KEY,
): PartnerRepository {
  return {
    load() {
      const raw = storage?.getItem(key);
      if (!raw) return null;
      try {
        const parsed: unknown = JSON.parse(raw);
        if (!isPartnerState(parsed)) return null;
        const saved = readMessages((parsed as { messages?: unknown }).messages);
        return { ...parsed, messages: withSeedMessages(saved), notice: null };
      } catch {
        // 깨진 데이터는 버리고 데모 데이터로 다시 시작한다.
        return null;
      }
    },
    save(state) {
      if (!storage) return { ok: true };
      try {
        storage.setItem(key, JSON.stringify({ ...state, notice: null }));
        return { ok: true };
      } catch {
        return { ok: false, error: '브라우저 저장 공간이 가득 찼어요. 오래된 사진이 많으면 데모 데이터를 초기화해 주세요.' };
      }
    },
    clear() {
      storage?.removeItem(key);
    },
  };
}

